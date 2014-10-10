// ==[ Dependencies ]======================================
//TODO: rewrite, using gulp-load-plugins
var gulp = require('gulp'),
    pkg = require('./package.json'),
    _ = require('underscore'),
    less = require('gulp-less'),
    path = require('path'),
    template = require('gulp-template'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    sourcemaps = require('gulp-sourcemaps'),
    vulcanize = require('gulp-vulcanize'),
    webserver = require('gulp-webserver'),
    config = require('./app/config.json'),
    yargs = require('yargs'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    replace = require('gulp-replace'),
    templateCache = require('gulp-angular-templatecache'),
    htmlify = require('gulp-angular-htmlify'),
    streamqueue = require('streamqueue'),
    changed = require('gulp-changed'),
    ngAnnotate = require('gulp-ng-annotate'),
    wrap = require('gulp-wrap'),
    del = require('del');

_.str = require('underscore.string');
// ========================================================

// ==[ Error Handling ]====================================
// `gulp --fatal=error` determines what kind of errors should be fatal
// - see for more info: http://www.artandlogic.com/blog/2014/05/error-handling-in-gulp/
// - more examples: http://truongtx.me/2014/07/15/handle-errors-while-using-gulp-watch/

var fatalLevel = yargs.argv.fatal,
    ERROR_LEVELS = ['error', 'warning'];

function isFatal(level) {
  return ERROR_LEVELS.indexOf(level) <= ERROR_LEVELS.indexOf(fatalLevel || 'error');
}

function handleError(level, error) {
  notify.onError({
    title: "Gulp",
    subtitle: level + "!",
    message: "Error: <%= error.message %>",
    sound: "Sosumi"
  })(error);

  gutil.log(error.message);
  gutil.log(error.stack);

  if (isFatal(level)) {
    process.exit(1);
  }

  this.emit('end');
}

function onError(error) {
  handleError.call(this, 'error', error);
}
function onWarning(error) {
  handleError.call(this, 'warning', error);
}

// ========================================================

//TODO: common piped task for multi-env configuration?
//TODO: sitemap?
//TODO: asset fingerprinting?
//TODO: jshintrc - look at https://gist.github.com/connor/1597131
//TODO: add 404.html and other templates

//gulp-notify defaults for completed tasks
//  official config examples: https://github.com/mikaelbr/gulp-notify/blob/master/examples/gulpfile.js
var notifyConf = {
  title: "Gulp",
  subtitle: "Finished",
  sound: "Tink" // refer to OSX Sound Preferences
};

//merge env config into common config
var node_env = process.env.NODE_ENV || 'development',
    conf = _.extend(
        _.pick(pkg, 'title', 'description'),
        config['common'],
        config[node_env],
        {ustr: _.str} // makes underscore.str available in templates
    );

var buildFolder = conf["build_folder"] || "dist";

gulp.task('html', function () {
  return gulp.src('app/pages/**/*.html')
      .pipe(plumber({errorHandler: onError}))
      .pipe(template(conf))
      .pipe(gulp.dest(buildFolder))
      .pipe(notify(_.extend(notifyConf, {message: 'HTML task complete'})));
});

var vendorJsFiles = [
  "vendor/bower/underscore/underscore.js",
  "vendor/bower/underscore.string/lib/underscore.string.js",
  "vendor/bower/angular/angular.js",
  "vendor/bower/angular-cookies/angular-cookies.js",
  "vendor/bower/angular-route/angular-route.js",
  "vendor/bower/angular-resource/angular-resource.js",
  "vendor/bower/angular-bootstrap/ui-bootstrap-tpls.js",
  "vendor/bower/angular-ui-router/release/angular-ui-router.js",
  "vendor/bower/angulartics/src/angulartics.js",
  "vendor/bower/angulartics/src/angulartics-ga.js",
  "vendor/bower/restangular/dist/restangular.js"
];

var appJsFiles = [
  "app/js/application.js",
  "app/js/**/*.js"
];

//TODO: fix JS Hint, so that it's relevant
//  i only want it to lint my files, but it needs the vendor files for reference...
gulp.task('jshint', function () {
  return streamqueue({objectMode: true},
      //first, process vendor js,
      gulp.src(vendorJsFiles),

      //then, process app js
      gulp.src(appJsFiles)
          .pipe(ngAnnotate())
          .pipe(template(conf))
          .pipe(concat('app.js')))

      .pipe(plumber({errorHandler: onWarning}))
      .pipe(concat('app.js'))
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      .pipe(notify(_.extend(notifyConf, {message: 'JSHint task complete'})));
});

gulp.task('js', function () {
  return streamqueue({objectMode: true},
      //first, process vendor js, without iife so they are global
      gulp.src(vendorJsFiles),

      //now, insert an IIFE header (yes .. really)
      gulp.src(['./iife/header.js']),

      //then, process app js
      gulp.src(appJsFiles)
          .pipe(plumber({errorHandler: onError}))
          .pipe(ngAnnotate())
          .pipe(template(conf))
          .pipe(wrap('(function(){ \'use strict\'; <%= contents %> })();')),

      //finally, process templates
      gulp.src('app/templates/**/*.html')
          .pipe(plumber({errorHandler: onError}))
          .pipe(templateCache({module: 'app'}))
          .pipe(htmlify())
          .pipe(concat('templates.js'))
          .pipe(wrap('(function(){ <%= contents %> })();')),

      //oh, and IIFE footer.  yeesh, this feels dirty.
      //  i'm trying to this an meet the following criteria
      //  1) end up with ONE app.js file to serve
      //  2) only app/js/**/*.js and templates are wrapped in an IIFE, not vendor
      //  3) sourcemaps don't break (concat can only be used once AFAIK)
      //  4) no tempfiles
      gulp.src(['./iife/footer.js']))

      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(buildFolder + '/js'))
      .pipe(notify(_.extend(notifyConf, {message: 'JS task complete'})));
});

var vendorCssFiles = [
  "vendor/bower/normalize-css/normalize.css",
  "vendor/bower/font-awesome/css/font-awesome.css"
];

var appCssFiles = [
  "app/css/**/*.less"
];

gulp.task('less', function () {
  return gulp.src(vendorCssFiles.concat(appCssFiles))
      .pipe(plumber({errorHandler: onError}))
      .pipe(sourcemaps.init())//TODO: fix sourcemaps with multiple sources
      .pipe(concat('app.js'))
      .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')]
      }))
      .pipe(gulp.dest(buildFolder + '/css'))
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write())
      .pipe(notify(_.extend(notifyConf, {message: 'LESS task complete'})));
});

gulp.task('img', function () {
  var DEST = buildFolder + '/sounds';
  return gulp.src('app/img/**/*')
      .pipe(plumber({errorHandler: onError}))
      .pipe(changed(DEST))
      .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
      .pipe(gulp.dest(DEST))
      .pipe(notify(_.extend(notifyConf, {message: 'Img task complete'})));
});

gulp.task('sounds', function () {
  var DEST = buildFolder + '/sounds';
  return gulp.src('app/sounds/**/*')
      .pipe(plumber({errorHandler: onError}))
      .pipe(changed(DEST))
      .pipe(gulp.dest(DEST))
      .pipe(notify(_.extend(notifyConf, {message: 'Sounds task complete'})));
});

gulp.task('fonts', function () {
  var DEST = buildFolder + '/fonts';
  return gulp.src(['vendor/bower/fontawesome/fonts/*', 'vendor/bower/bootstrap/fonts/*'])
      .pipe(plumber({errorHandler: onError}))
      .pipe(changed(DEST))
      .pipe(gulp.dest(DEST))
      .pipe(notify(_.extend(notifyConf, {message: 'Fonts task complete'})));
});

gulp.task('vulcanize', function () {
  return gulp.src('app/components/build.html')
      .pipe(plumber({errorHandler: onError}))
      .pipe(vulcanize({
        // refer here for options: https://github.com/Polymer/grunt-vulcanize#options
        dest: buildFolder + '/components',
        inline: true,
        csp: true,
        strip: (node_env === 'production' || node_env === 'staging')
      }))
    // TODO: better way to resolve this than to use gulp-replace? open github issue?
      .pipe(replace('../../vendor/bower/fontawesome/fonts', '../fonts'))
      .pipe(gulp.dest(buildFolder + '/components'))
      .pipe(notify(_.extend(notifyConf, {message: 'Vulcanize task complete'})));
});

gulp.task('clean', function (cb) {
  del([buildFolder + '/css',
        buildFolder + '/js',
        buildFolder + '/img',
        buildFolder + '/sounds',
        buildFolder + '/components',
        buildFolder + '/fonts',
        buildFolder + '/index.html',
        buildFolder + '/templates.js'],
      cb)
});

gulp.task('default', ['clean'], function () {
  gulp.start('html', 'less', 'js', 'img', 'vulcanize', 'fonts', 'sounds');
});

gulp.task('watch', function () {
  fatalLevel = fatalLevel || 'off';
  gulp.watch('app/config.json', ['js', 'html']);
  gulp.watch('app/css/**/*.less', ['less']);
  gulp.watch(['app/js/**/*.js', 'app/templates/**/*.html'], ['js']);
  gulp.watch('app/sounds/**/*', ['sounds']);
  gulp.watch('app/img/**/*', ['img']);
  gulp.watch('app/pages/**/*.html', ['html']);
  gulp.watch('app/components/**/*.html', ['vulcanize']);
});

gulp.task('webserver', function () {
  gulp.src('dist')
      .pipe(webserver({
        livereload: true,
        port: 8000,
        open: true
      }));
});
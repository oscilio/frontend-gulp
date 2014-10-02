// ==[ Dependencies ]======================================
var gulp = require('gulp'),
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
    pkg = require('./package.json'),
    yargs = require('yargs'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    del = require('del');
// ========================================================

// ==[ Error Handling ]====================================
// `gulp --fatal=error` determines what kind of errors should be fatal
// see for more info: http://www.artandlogic.com/blog/2014/05/error-handling-in-gulp/

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

//TODO: pull out jshint task from js task
//TODO: common piped task for multi-env configuration?
//TODO: test livereload
//TODO: setup basic angular app
//TODO: task for angular templates [gulp-html2tpl](https://www.npmjs.org/package/gulp-html2tpl)
//TODO: alternate lib for angular templates [gulp-jst-concat](https://www.npmjs.org/package/gulp-jst-concat)
//TODO: errors task
//TODO: polymer js/platform.js
//TODO: google analytics config
//TODO: gulp rss?
//TODO: sitemap?
//TODO: asset fingerprinting?
//TODO: jshintrc - look at https://gist.github.com/connor/1597131
//TODO: add 404.html and other templates

//gulp-notify defaults for completed tasks
var notifyConf = {
  title: "Gulp",
  subtitle: "Finished",
  sound: "Tink" // refer to OSX Sound Preferences
}

//merge env config into common config
var node_env = process.env.NODE_ENV || 'development',
    conf = _.extend(
        _.pick(pkg, 'title', 'description'),
        config['common'],
        config[node_env]);

gulp.task('html', function () {
  return gulp.src('app/pages/**/*.html')
      .pipe(plumber({errorHandler: onError}))
      .pipe(template(conf))
      .pipe(gulp.dest('dist'))
      .pipe(notify(_.extend(notifyConf,{message: 'HTML task complete'})));
});

gulp.task('js', function () {
  return gulp.src('app/js/**/*.js')
      .pipe(plumber({errorHandler: onError}))
      .pipe(sourcemaps.init())
      .pipe(template(conf))
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      .pipe(concat('app.js'))
      .pipe(gulp.dest('dist/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/js'))
      .pipe(notify(_.extend(notifyConf,{message: 'JS task complete'})));
});

gulp.task('less', function () {
  return gulp.src('./app/css/**/*.less')
      .pipe(sourcemaps.init())
      .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')]
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/css'))
      .on('error', onError)
      .pipe(notify(_.extend(notifyConf,{message: 'LESS task complete'})));
});

gulp.task('img', function () {
  return gulp.src('app/img/**/*')
      .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
      .pipe(gulp.dest('dist/img'))
      .pipe(notify(_.extend(notifyConf,{message: 'Img task complete'})));
});

gulp.task('vulcanize', function () {
  return gulp.src('app/components/build.html')
      .pipe(vulcanize({dest: 'dist/components'}))
      .pipe(gulp.dest('dist/components'))
      .on('error', onError)
      .pipe(notify(_.extend(notifyConf,{message: 'Vulcanize task complete'})));
});

gulp.task('clean', function (cb) {
  del(['dist/css', 'dist/js', 'dist/img', 'dist/components', 'dist/index.html'], cb)
});

gulp.task('default', ['clean'], function () {
  gulp.start('html', 'less', 'js', 'img', 'vulcanize');
});

gulp.task('watch', function () {
  fatalLevel = fatalLevel || 'off';
  gulp.watch('app/config.json', ['js', 'html']);
  gulp.watch('app/css/**/*.less', ['less']);
  gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch('app/img/**/*', ['img']);
  gulp.watch('app/pages/**/*.html', ['html']);
  gulp.watch('app/components/build.html', ['vulcanize']);
});

gulp.task('webserver', function () {
  gulp.src('dist')
      .pipe(webserver({
        livereload: true,
        directoryListing: {
          enable: true,
          path: 'dist'
        },
        open: true
      }));
});
var gulp = require('gulp'),
    _ = require('underscore'),
    less = require('gulp-less'),
    path = require('path'),
    template = require('gulp-template'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
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
    preprocess = require('gulp-preprocess'),
    config = require('./app/config.json'),
    pkg = require('./package.json'),
    del = require('del');

//TODO: add multi-environment configuration
//TODO: common piped task for multi-env configuration?
//TODO: pull site title from package.json name
//TODO: rename main.css => app.css && main.js => app.js
//TODO: test livereload
//TODO: underscore/lodash for preprocessing [gulp-template](https://www.npmjs.org/package/gulp-template)
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

//merge env config into common config
var node_env = process.env.NODE_ENV || 'development',
    conf = _.extend(_.pick(pkg, 'title'), config['common'], config[node_env]);

gulp.task('html', function () {
  return gulp.src('app/pages/**/*.html')
      .pipe(template(conf))
      .pipe(gulp.dest('dist'))
      .pipe(notify({message: 'HTML task complete'}));
});

gulp.task('js', function () {
  return gulp.src('app/js/**/*.js')
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
      .pipe(notify({message: 'JS task complete'}));
});

gulp.task('less', function () {
  return gulp.src('./app/css/**/*.less')
      .pipe(sourcemaps.init())
      .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')]
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/css'))
      .pipe(notify({message: 'Less task complete'}));
});

gulp.task('img', function () {
  return gulp.src('app/img/**/*')
      .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
      .pipe(gulp.dest('dist/img'))
      .pipe(notify({message: 'Img task complete'}));
});

gulp.task('clean', function (cb) {
  del(['dist/css', 'dist/js', 'dist/img', 'dist/components', 'dist/index.html'], cb)
});

gulp.task('default', ['clean'], function () {
  gulp.start('html', 'less', 'js', 'img', 'vulcanize');
});

gulp.task('vulcanize', function () {
  return gulp.src('app/components/index.html')
      .pipe(vulcanize({dest: 'dist/components'}))
      .pipe(gulp.dest('dist/components'))
      .pipe(notify({message: 'Vulcanize task complete'}));
});

gulp.task('watch', function () {
  gulp.watch('app/css/**/*.less', ['less']);
  gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch('app/img/**/*', ['img']);
  gulp.watch('app/pages/**/*.html', ['html']);
  gulp.watch('app/components/index.html', ['components']);
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
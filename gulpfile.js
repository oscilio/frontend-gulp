var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
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
    del = require('del');

//TODO: test livereload
//TODO: errors task
//TODO: .jshintrc

var api_url = 'localhost:3000',
    node_env = 'production';

gulp.task('html', function () {
  return gulp.src('app/pages/**/*.html')
      .pipe(preprocess({
        context: {
          NODE_ENV: node_env
        }
      }))
      .pipe(gulp.dest('dist'))
      .pipe(notify({message: 'HTML task complete'}));
});

gulp.task('js', function () {
  return gulp.src('app/js/**/*.js')
    //.pipe(jshint('.jshintrc'))
      .pipe(sourcemaps.init())
      .pipe(preprocess({
        context: {
          NODE_ENV: node_env,
          API_URL: api_url
        }
      }))
      .pipe(jshint.reporter('default'))
      .pipe(concat('main.js'))
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
  del(['dist/css', 'dist/js', 'dist/img'], cb)
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
  gulp.watch('app/css/**/*.scss', ['styles']);
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/img/**/*', ['images']);
  gulp.watch('app/components/**/*', ['components']);
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
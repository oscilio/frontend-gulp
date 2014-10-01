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
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    vulcanize = require('gulp-vulcanize'),
    webserver = require('gulp-webserver'),
    del = require('del');

//TODO: add sourcemaps for js
//TODO: finish configuring webserver & livereload
//TODO: html task

gulp.task('js', function () {
  return gulp.src('app/js/**/*.js')
      //.pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('dist/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'))
      .pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('less', function () {
  return gulp.src('./app/css/**/*.less')
      .pipe(sourcemaps.init())
      .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')]
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/css'));
});

gulp.task('images', function () {
  return gulp.src('app/img/**/*')
      .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
      .pipe(gulp.dest('dist/img'))
      .pipe(notify({message: 'Images task complete'}));
});

gulp.task('clean', function (cb) {
  del(['dist/css', 'dist/js', 'dist/img'], cb)
});

gulp.task('vulcanize', function () {
  return gulp.src('app/components/index.html')
      .pipe(vulcanize({dest: 'dist/components'}))
      .pipe(gulp.dest('dist/components'));
})

gulp.task('default', ['clean'], function () {
  gulp.start('less', 'js', 'images');
});

gulp.task('watch', function () {
  gulp.watch('app/css/**/*.scss', ['styles']);
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/img/**/*', ['images']);
});

gulp.task('webserver', function() {
  gulp.src('dist')
      .pipe(webserver({
        livereload: true,
        directoryListing: true,
        open: true
      }));
});
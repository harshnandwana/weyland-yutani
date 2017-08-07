'use strict';

var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    cssmin      = require('gulp-cssmin'),
    rename      = require('gulp-rename'),
    prefix      = require('gulp-autoprefixer'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    imagemin    = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();

var scripts = [
  '../assets/js/lib/jquery-3.2.1.min.js',
  '../assets/js/lib/headroom/headroom.min.js',
  '../assets/js/lib/headroom/jQuery.headroom.js',
  '../assets/js/lib/scrollmagic/ScrollMagic.min.js',
  '../assets/js/app.js'
];

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'js'], function() {

    browserSync.init({
        server: '../',
        browser: "google chrome"
    });

    gulp.watch('../assets/scss/**/*.scss', ['sass']);
    gulp.watch('../assets/js/**/*.js', ['js']);
    gulp.watch('../*.html').on('change', browserSync.reload);
});

// Configure CSS tasks.
gulp.task('sass', function () {
  return gulp.src('../assets/scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(prefix('last 2 versions'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('../dist/css'))
    .pipe(browserSync.stream());
});

// Configure JS.
gulp.task('js', function() {
  return gulp.src(scripts)
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('../dist/js'))
    .pipe(browserSync.stream());
});

// Configure image stuff.
gulp.task('images', function () {
  return gulp.src('../assets/img/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('../dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  gulp.watch('../assets/img/**/*.+(png|jpg|gif|svg)');
  gulp.watch('../dist/scss/**/*.scss', ['sass']);
  gulp.watch('../dist/js/**/*.js', ['js']);
  gulp.watch('../*.html').on('change', browserSync.reload);
});

gulp.task('default', ['sass', 'js', 'images', 'serve']);

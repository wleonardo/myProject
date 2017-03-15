'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('gulp-browserify');
const swig = require('gulp-swig');
const runSequence = require('run-sequence');
const clean = require('gulp-clean');
const electron = require('electron-connect').server.create();

gulp.task('clean', function() {
  return gulp.src('./dist', { read: false })
    .pipe(clean());
});

gulp.task('copy-base', function() {
  return gulp.src('./app/base/**')
    .pipe(gulp.dest('./dist/base'));
});

gulp.task('sass', function() {
  return gulp.src('./app/style/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({}))
    .pipe(gulp.dest('./dist/style'));
});

gulp.task('html', function() {
  gulp.src('./app/page/**/*.html')
    // .pipe(swig({ defaults: { cache: false } }))
    //.pipe(prettify())
    .pipe(gulp.dest('./dist/page/'));
});

gulp.task('js', function() {
  gulp.src(['./app/js/**.js'])
    // .pipe(browserify({}))
    // .on('error', function(err) {
    //   console.log('Less Error!', err.message);
    //   this.end();
    // })
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('reload', function() {
  electron.reload();
});

gulp.task('compile', function(callback) {
  runSequence('clean', 'copy-base', 'js', ['sass', 'html'],
    callback);
});


gulp.task('serve', ['compile'], function() {

  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('main.js', electron.restart);

  gulp.watch(['app/js/**.js'], function(event) {
    runSequence('js', function() {
      setTimeout(function() {
        electron.reload();
      }, 500);
    });
  });

  gulp.watch(['app/style/**/*.scss'], function(event) {
    runSequence('sass', function() {
      electron.reload();
    });
  });

  gulp.watch(['app/**/*.html'], function(event) {
    runSequence('html', function() {
      electron.reload();
    });
  });

  gulp.watch('app/base/**', function(event) {
    runSequence('copy-base', function() {
      electron.reload();
    });
  });
});

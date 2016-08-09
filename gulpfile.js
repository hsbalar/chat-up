const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const gutil = require('gulp-util');
const hub = require('gulp-hub');
const del = require('del');

const config = {
  dist: 'build',
};

gulp.task('clean', function () {
  return del.sync(config.dist);
});

gulp.task('lint', function () {
  gulp
    .src(['server/**/*.js'])
    .pipe($.plumber())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('server', ['lint'], function () {
  $.nodemon({
    nodeArgs: ['--harmony'],
    env: {
      NODE_ENV: 'development',
    },
    watch: ['app.js', 'config.js', 'server/'],
    script: 'app.js',
  }).on('restart', function () {
    gutil.log('Server restarted...');
  });
});

gulp.task('default', ['server']);

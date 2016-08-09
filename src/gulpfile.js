const gulp = require('gulp');
const gutil = require('gulp-util');
const $ = require('gulp-load-plugins')();

const fs = require('fs');
const del = require('del');
const path = require('path');

const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const merge = require('merge-stream');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const runSequence = require('run-sequence');
const eventStream = require('event-stream');

const config = {
  debug: (process.env.NODE_ENV || 'development') === 'development',
  dist: path.join(__dirname, 'build'),
};

const vendor = require('./vendor.json');
const buildConfig = require('./package.json').buildConfig;

const VENDOR_JS = config.dist + '/js/vendor.js';
const VENDOR_CSS = config.dist + '/css/vendor.css';

function isNewer(source, dest) {
  if (!fs.existsSync(source)) {
    return false;
  }
  if (!fs.existsSync(dest)) {
    return true;
  }
  return fs.statSync(source).mtime > fs.statSync(dest).mtime;
}

gulp.task('clean', function () {
  return del.sync([config.dist]);
});

gulp.task('vendor:copy', function () {
  if (fs.existsSync(VENDOR_CSS)) {
    return;
  }

  // copy resources
  for (var src in vendor.copy) {
    if (vendor.copy.hasOwnProperty(src)) {
      gulp.src(src).pipe(gulp.dest(config.dist + '/' + vendor.copy[src]));
    }
  }
});

gulp.task('vendor:less', function () {
  if (
    !isNewer('./assets/less/vendor.less', VENDOR_CSS) &&
    !isNewer('./assets/less/variables.less', VENDOR_CSS) &&
    !isNewer('./vendor.json', VENDOR_CSS)
  ) {
    return;
  }

  return gulp
    .src('assets/less/vendor.less')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe(config.debug ? gutil.noop() : $.minifyCss())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.dist + '/css'));
});

gulp.task('vendor:js', function () {
  if (!isNewer('./vendor.json', VENDOR_JS)) {
    return;
  }

  // contact stream
  var stream1 = gulp.src(vendor.concat);

  // require stream
  var stream2 = browserify({
    debug: config.debug,
  });

  // apply require()
  vendor.require.map(stream2.require.bind(stream2));

  stream2 = stream2.bundle().pipe(source('js/vendor-modules.js'));

  return merge(stream1, stream2)
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.concat('js/vendor.js'))
    .pipe(config.debug ? gutil.noop() : $.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.dist));
});

gulp.task('less', function () {
  var cfg = buildConfig.less || {};
  var entries = cfg.entries || ['app.less'];
  var all = [];

  entries.forEach(function (entry) {
    all.push(lessify(entry));
  });
  return eventStream.merge(all);
});

function lessify(entry) {
  var file = path.join(__dirname, 'assets/less/' + entry);
  if (!fs.existsSync(file)) {
    throw new gutil.PluginError(
      'LESS',
      'Error: File ' + entry + ' does not exist !'
    );
  }
  return gulp
    .src(file)
    .pipe(
      $.plumber({
        errorHandler: function (err) {
          gutil.log('Less Error', err);
          this.emit('end');
        },
      })
    )
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe(config.debug ? gutil.noop() : $.minifyCss())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.dist + '/css'));
}

function browserifyTask(watch) {
  var cfg = buildConfig.browserify || {};
  var entries = cfg.entries || ['app.js'];
  var commons = cfg.commons;
  var all = [];

  if (commons && commons.length > 0) {
    all.push(bundlifyTask(watch, 'commons.js', commons));
  }

  entries.forEach(function (entry) {
    all.push(bundlifyTask(watch, entry, [entry], commons));
  });

  return eventStream.merge(all);
}

function bundlifyTask(watch, output, entries, commons) {
  var external = vendor.require || [];

  if (commons && commons.length) {
    external = external.concat(
      commons.map(function (n) {
        return './assets/js/' + n;
      })
    );
  }

  var browserified = browserify({
    entries: entries.map(function (n) {
      return './assets/js/' + n;
    }),
    extensions: ['.js', '.jsx'],
    debug: config.debug,
    paths: ['node_modules', 'public/js', 'assets/js'],
  });

  // all vendor modules should be marked as external
  external.map(browserified.external.bind(browserified));

  // babelify
  browserified = browserified.transform(babelify);

  // watchify
  if (watch) {
    browserified = watchify(browserified);
  }

  function bundler() {
    return browserified
      .bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('js/' + output))
      .pipe(buffer())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe(config.debug ? gutil.noop() : $.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(config.dist));
  }

  browserified.on('update', bundler); // on any dep update, runs the bundler
  browserified.on('log', function (e) {
    // output build logs to terminal
    gutil.log('[browserify]', e);
  });

  return bundler();
}

//browserify without watch
gulp.task('browserify:build', function () {
  return browserifyTask(false);
});

//browserify with watch
gulp.task('browserify:watch', function () {
  return browserifyTask(true);
});

gulp.task('lint', function () {
  gulp
    .src(['src/**/*.js', 'assets/js/**/*.js'])
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('watch', ['build', 'browserify:watch'], function () {
  gulp.watch(
    [
      'assets/less/**',
      '!assets/less/vendor.less',
      '!assets/less/variables.less',
    ],
    ['less']
  );
  gulp.watch(
    ['assets/less/vendor.less', 'assets/less/variables.less'],
    ['vendor:less', 'less']
  );
});

gulp.task('vendor', ['vendor:copy', 'vendor:less', 'vendor:js']);
gulp.task('build', function (done) {
  runSequence('clean', 'lint', ['vendor', 'less', 'browserify:build'], done);
});

gulp.task('default', ['watch']);

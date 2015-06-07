var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var watchify = require('watchify');
var rimraf = require('rimraf');

var conf = {
  JS_ENTRY: './src/js/entry.js',
  CSS_PATTERN: './src/css/**/*.css',
  ASSET_PATTERN: './src/assets/**/*',
  STATIC_DIR: './dist/',
  JS_BUNDLE: 'app.js',
  CSS_BUNDLE: 'app.css'
};

gulp.task('watch', function() {
  gulp.watch(conf.ASSET_PATTERN, ['static']);
  gulp.watch(conf.CSS_PATTERN, ['css']);
});

gulp.task('clean', function () {
  rimraf.sync(conf.STATIC_DIR);
});

gulp.task('static', function() {
  return gulp.src(conf.ASSET_PATTERN)
  .pipe(gulp.dest(conf.STATIC_DIR));
});

gulp.task('css', function () {
  return gulp.src(conf.CSS_PATTERN)
  .pipe(concat(conf.CSS_BUNDLE))
  .pipe(gulp.dest(conf.STATIC_DIR));
});

gulp.task('build-dev', function() {
    var bundler = browserify({
        entries: [conf.JS_ENTRY],
        transform: [babelify],
        debug: true, // sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // watchify reqs
    }); 
    var watcher = watchify(bundler);
    return watcher
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .on('update', function () {
          console.log('Updating: ', arguments);
          watcher.bundle()
            .pipe(source(conf.JS_BUNDLE))
            .pipe(gulp.dest(conf.STATIC_DIR));
      })
      .bundle()
      .pipe(source(conf.JS_BUNDLE))
      .pipe(gulp.dest(conf.STATIC_DIR));
});

gulp.task('build-prod', function() {
  return browserify({
      entries: [conf.JS_ENTRY],
      transform: [babelify],
      debug: false
    })
    .bundle()
    .pipe(source(conf.JS_BUNDLE))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(conf.STATIC_DIR));
});

gulp.task('default', [
  'static',
  'build-dev',
  'css',
  'watch'
]);

gulp.task('release', [
  'clean',
  'build-prod',
  'static',
  'css'
]);

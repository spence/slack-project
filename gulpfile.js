var babelify = require('babelify');
var browserify = require('browserify');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var watchify = require('watchify');

var conf = {
  JS_ENTRY: './src/js/entry.js',
  CSS_PATTERN: './src/css/**/*.css',
  HTML_SRC: './src/index.html',
  STATIC_DIR: './app/static/',
  JS_BUNDLE: 'app.js',
  CSS_BUNDLE: 'app.css',
  HTML_DEST: './app/static/index.html'
};

gulp.task('watch', function() {
  // gulp.watch(conf.HTML_SRC, ['static']);
  gulp.watch(conf.CSS_PATTERN, ['css']);
});

// gulp.task('static', function() {
//   return gulp.src(conf.HTML_SRC)
//   .pipe(gulp.dest(conf.STATIC_DIR));
// });

gulp.task('css', function () {
  return gulp.src(conf.CSS_PATTERN)
  .pipe(concat(conf.CSS_BUNDLE))
  .pipe(gulp.dest(conf.STATIC_DIR));
});

gulp.task('build', function() {
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
            // .pipe(buffer())
            // .pipe(uglify())
            .pipe(gulp.dest(conf.STATIC_DIR));
      })
      .bundle()
      .pipe(source(conf.JS_BUNDLE))
      // .pipe(buffer())
      // .pipe(uglify())
      .pipe(gulp.dest(conf.STATIC_DIR));
});

gulp.task('default', [
  // 'static',
  'build',
  'css',
  'watch'
]);

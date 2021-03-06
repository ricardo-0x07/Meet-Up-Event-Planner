/* eslint-env node */

var gulpUtil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var ghPages = require('gulp-gh-pages');

gulp.task('default', ['styles', 'lint', 'copy-html', 'vulcanize-elems', 'copy-images', 'copy-spec', 'js'],
  function() {
    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/js/**/*.js', ['lint', 'scripts']);
    gulp.watch('src/*.html', ['copy-html']);
    // gulp.watch('src/jasmine/spec/spec.js', ['copy-spec']);
    gulp.watch('dist/index.html').on('change', browserSync.reload);

    browserSync.init({
      // server: './dist'
      notify: false,
      port: 3002,
      server: {
        baseDir: './dist',
        middleware: function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          req.mode = 'no-cors';
          next();
        }
      }

    });
  });

gulp.task('vulcanize-elems', function() {
  return gulp.src('src/polymer-elements/elements.html')
    .pipe(vulcanize({
      abspath: '',
      excludes: [],
      stripExcludes: false,
      inlineScripts: true,
      inlineCss: true,
      stripComments: true
    })).on("error", function(err) {
      console.log(err);
    })
    .pipe(gulp.dest('dist/polymer-elements/'));
});

gulp.task('dist', [
  'copy-html',
  'copy-images',
  'styles',
  'lint',
  'deploy'
]);

gulp.task('scripts', function() {
  gulp.src('src/js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist', function() {
  gulp.src('src/js/**/*.js')
  .pipe(sourcemaps.init())
		.pipe(concat('all.js'))
		.pipe(uglify())
    .pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function() {
  gulp.src('src/*.html').pipe(gulp.dest('./dist'));
});

gulp.task('copy-spec', function() {
  gulp.src('src/jasmine/spec/spec.js').pipe(gulp.dest('./dist/jasmine/spec/'));
});

gulp.task('copy-images', function() {
  gulp.src('src/img/*').pipe(imagemin({
    progressive: true,
    use: [pngquant()]
  })).pipe(gulp.dest('./dist/img'));
});

gulp.task('styles', function() {
  gulp.src('src/sass/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
  browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('lint', function() {
  return gulp.src(['src/js/**/*.js'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
		.pipe(eslint.failOnError());
});

gulp.task('tests', function() {
  gulp.src('src/jasmine/spec/spec.js')
   .pipe(jasmine());
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

var b = browserify({
  entries: ['./src/js/main.js'],
  cache: {},
  packageCache: {},
  plugin: [watchify],
  debug: true
});

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gulpUtil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gulpUtil.log.bind(gulpUtil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}

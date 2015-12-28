var gulp = require('gulp');
//npm install --save-dev gulp-concat gulp-clean gulp-uglify gulp-zip gulp-minify-css gulp-imagemin
var concat = require('gulp-concat'),
 clean = require('gulp-clean'),
 uglify = require('gulp-uglify'),
 zip = require('gulp-zip'),
 minifyCSS = require('gulp-minify-css'),
 imagemin = require('gulp-imagemin');

var paths = {
  build:'build',
  zipdir:'release',
  zipfile:'eyetraffic.zip',
  scripts: 'src/**/*.js',
  images: 'src/images/**/*',
  css: 'src/**/*.css',
  data:['src/_locales/**/*'],
  tpl:['templates/**/*']
};
gulp.task('clean', function() {
	  return gulp.src([paths.build], {read: false})
	    .pipe(clean());
});

gulp.task('scripts', function() {
	  // Minify and copy all JavaScript (except vendor scripts)
	  return gulp.src(paths.scripts)
	    .pipe(uglify())
	    .pipe(concat('all.min.js'))
	    .pipe(gulp.dest(paths.build));
});

//Copy all static images
gulp.task('images', function() {
 return gulp.src(paths.images, { base: './' })
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.build));
});

gulp.task('minify-css', function() {
  gulp.src(paths.css)
    .pipe(minifyCSS({}))
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest(paths.build))
});

//Copy all JSON resources
gulp.task('locale', function() {
 return gulp.src(paths.data, { base: './' })
    .pipe(gulp.dest(paths.build));
});
//Copy manifest.json
gulp.task('templates', function() {
 return gulp.src(paths.tpl)
    .pipe(gulp.dest(paths.build));
});

gulp.task('zip', function() {
	  return gulp.src(paths.build+'/**/*')
	  .pipe(zip(paths.zipfile))
	  .pipe(gulp.dest(paths.zipdir));
});

gulp.task('default', ['scripts', 'minify-css', 'images', 'locale', 'templates', 'zip']);
var gulp = require('gulp'),
  babel = require("gulp-babel"),
  sourcemaps = require("gulp-sourcemaps"),
  concat = require("gulp-concat"),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./public/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('html', function(){
    gulp.src('./app/views/index.jade')
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/scss/*.scss', ['sass']);
  gulp.watch('./public/js/**/*.html', ['html']);
  gulp.watch('./public/js/**/*.js', ['html']);
});

gulp.task('babel', function(){
  return gulp.src("public/js/**/*.js")
   .pipe(sourcemaps.init())
   .pipe(babel())
   .pipe(concat("all.js"))
   .pipe(sourcemaps.write("."))
   .pipe(gulp.dest("dist"));
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee jade',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'sass',
  'html',
  'develop',
  'watch'
]);

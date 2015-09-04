var gulp = require('gulp');
// var minify = require('gulp-uglify'); //minify
var sass = require('gulp-sass'); // sass
// var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
// var jshint = require('gulp-jshint');

// gulp.task('jshint',function () {
//   gulp.src('./gulp/*.js')
//   .pipe(jshint())
//   .pipe(jshint.reporter('default'));
// });

gulp.task('start',function () {
  nodemon({
    script: "server.js",
    ext: "js html ejs scss",
    env: {'NODE_ENV':"development"},
    // tasks: ['jshint','concat','sass']
    tasks: ['sass']
  });
});

// gulp.task('minify', function () {
//   gulp.src('./gulp/*.js')
//   .pipe(minify())
//   .pipe(gulp.dest('public/js'));
// });

// gulp.task('concat',function () {
//   gulp.src(['./gulp/first.js','./gulp/second.js'])
//   .pipe(concat('application.js'))
//   .pipe(minify())
//   .pipe(gulp.dest('./public/js'));
// });

gulp.task('sass', function () {
  gulp.src('./gulp/*.scss')
  .pipe(sass().on('error',sass.logError))
  .pipe(gulp.dest('public/css'));
});

// gulp.task('watch', function () {
//   gulp.watch(['./gulp/*.js'],['concat']);
//   gulp.watch(['./gulp/*.scss'],['sass']);
// });

// gulp.task('default',['jshint','concat','sass','start']);
gulp.task('default',['sass','start']);

var gulp = require('gulp');
var sass = require('gulp-sass'); // sass
var concat = require('gulp-concat');
var minify = require('gulp-uglify'); //minify
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
    tasks: ['concat','sass']
  });
});

// gulp.task('minify', function () {
//   gulp.src('./gulp/*.js')
//   .pipe(minify())
//   .pipe(gulp.dest('public/js'));
// });

gulp.task('concat',function () {
  gulp.src([
    './gulp/js/controllers/AppController.js'
    ,'./gulp/js/services/AppService.js'
    ,'./gulp/js/services/AuthService.js'
    ,'./gulp/js/app.routes.js'
    ,'./gulp/js/app.js'
    ,'./gulp/js/javascript.js'
  ]).pipe(concat('application.js'))
    .pipe(minify())
    .pipe(gulp.dest('./public/js'));
});

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
gulp.task('default',['sass','concat','start']);

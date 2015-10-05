var gulp = require('gulp');
var jshint = require('gulp-jshint');
var server = require('gulp-server-livereload');
var connect = require('gulp-connect');


// configure webserver task
gulp.task('connect', function() {
  connect.server({
    livereload: true,
  });
});

// configure jshint task
gulp.task('jshint', function() {
  return gulp.src('./client/public/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('html', function(){
  gulp.src('./client/public/*.html')
  .pipe(connect.reload());
});

gulp.task('css', function(){
  gulp.src('./client/public/css/*.css')
  .pipe(connect.reload());
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('js/*.js', ['jshint']);
  gulp.watch('./*.html', ['html']);
  gulp.watch('./css/*.css', ['css']);
  //this is saying on change to javascript files run jshint
});

// default task!
gulp.task('default', ['watch', 'connect']);

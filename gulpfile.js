var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    urlAdjuster = require('gulp-css-url-adjuster');
var version = process.env['ACS_VERSION'] || 'v3.8';

gulp.task('css-minify-and-url-versioning',function(){
      gulp.src('./src/main/webapp/css/master.css')
        .pipe(minifyCSS({
          keepBreaks:true,
          processImport:true,
          relativeTo:'./src/main/webapp/css/'
        }))
       .pipe(urlAdjuster({
          append: '?' + version
       }))
       .pipe(minifyCSS({
          relativeTo:'./src/main/webapp/css/'
        }))
       .pipe(gulp.dest('./target/webclient/css/'));
});

gulp.task('lint', function () {
    var jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish');
    gulp.src(['./src/main/webapp/js/*.js',
              './src/main/webapp/js/modules/**/*.js',
              '!./src/main/webapp/js/rjs.build.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['css-minify-and-url-versioning', 'lint']);

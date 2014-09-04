var gulp = require('gulp'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    phpServer = require('php-built-in-server'),
    scsslint = require('gulp-scsslint'),
    newer = require('gulp-newer'),
    cmq = require('gulp-combine-media-queries');



// EXTRAS // ---------------------------------------------------------
// CSS linting
gulp.task('lint-css', function() {
  return gulp.src(['dev/sass/**/*.scss', '!dev/sass/vendor/*.scss'])
    .pipe(scsslint())
    .pipe(scsslint.reporter());
});

// JS linting
gulp.task('lint-js', function() {
  return gulp.src(['dev/js/**/*.js', '!dev/js/vendor/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});



// ROOT TASKS // ---------------------------------------------------------
// Main style task  
gulp.task('css', function() {
  return gulp.src('dev/sass/application.scss')
    .pipe(compass({ // use compass for relative assets and plugins
      css: 'css',
      sass: 'dev/sass',
      font: 'font',
      image: 'img',
      require: ['sass-globbing'] // include compass plugins in this array
    }))
    .pipe(cmq()) // combine all @media queries into the page base
    .pipe(autoprefixer({cascade: false})) // auto prefix
    .pipe(minifycss()) // minify everything
    .pipe(gulp.dest('css'));
});

// Main Javascript task
gulp.task('js', function() {  
  return gulp.src('dev/js/**/*.js')
    .pipe(newer('js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

// Main image task
gulp.task('img', function() {
  return gulp.src('dev/img/**/*.{jpg,jpeg,png,gif,svg,ico}')
    .pipe(newer('img'))
    .pipe(imagemin({ 
      optimizationLevel: 5,
      progressive: true, 
      interlaced: true,
      svgoPlugins: [{
        collapseGroups: false,
        removeViewBox: false
      }]
    }))
    .pipe(gulp.dest('img'));
});



// FUNCTIONS // ---------------------------------------------------------
// Initial start function
gulp.task('start', ['img'], function() {
  gulp.start('js', 'css');
});

// Watch function
gulp.task('watch', ['start'], function() {
  gulp.watch('dev/sass/**/*.scss', ['css']);
  gulp.watch('dev/js/**/*.js', ['js']);
  gulp.watch('dev/img/**/*', ['img']);
 
  livereload.listen();
  gulp.watch(['layouts/*.html', 'partials/**/*.html', 'templates/*.html', 'js/**/*.js', 'img/**/*.{jpg,jpeg,png,gif,svg,ico}', 'css/*.css']).on('change', livereload.changed);
});

// Default function
gulp.task('default', ['watch'], function() {
  var server = new phpServer();
  
  server.on('listening', function(event) {});
  server.on('error', function (event) {});
  
  server.listen( '../../', 8000, 'localhost');
});
/* eslint-env node */

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const { deleteAsync } = require('del'); // ✅ исправление

// Очистка папки dist
gulp.task('clean', function () {
  return deleteAsync(['dist']);
});

// HTML
gulp.task('html', function () {
  console.log('===> html');
  return gulp
    .src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

// PHP
gulp.task('php', function () {
  console.log('===> php');
  return gulp.src('src/*.php').pipe(gulp.dest('dist'));
});

// Стили
gulp.task('styles', function () {
  console.log('===> styles');
  return gulp
    .src('src/sass/**/*.+(scss|sass)')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// Изображения
gulp.task('images', function () {
  console.log('===> images');
  return gulp.src('src/img/**/*', { encoding: false }).pipe(gulp.dest('dist/img'));
});

// SVG
gulp.task('svg', function () {
  console.log('===> svg');
  return gulp.src('src/svg/**/*').pipe(gulp.dest('dist/svg'));
});

// Шрифты
gulp.task('fonts', function () {
  console.log('===> fonts');
  return gulp.src('src/fonts/**/*', { encoding: false }).pipe(gulp.dest('dist/fonts'));
});

// Webpack
gulp.task('webpack', function (done) {
  console.log('===> webpack');
  webpack(webpackConfig, (err, stats) => {
    if (err) console.error(err);
    console.log(stats.toString({ colors: true, chunks: false }));
    browserSync.reload();
    done();
  });
});

// Server + Watch
gulp.task(
  'server',
  gulp.series('webpack', function () {
    browserSync.init({
      server: { baseDir: 'dist' }, // если нужен PHP, включи proxy ниже
      // proxy: "http://site.loc",
      files: ['dist/**/*.html', 'dist/**/*.css', 'dist/**/*.js'],
      notify: false,
      open: false,
    });

    gulp.watch('src/*.html', gulp.series('html'));
    gulp.watch('src/*.php', gulp.series('php'));
    gulp.watch('src/sass/**/*.+(scss|sass|css)', gulp.series('styles'));
    gulp.watch('src/img/**/*', gulp.series('images'));
    gulp.watch('src/svg/**/*', gulp.series('svg'));
    gulp.watch('src/fonts/**/*', gulp.series('fonts'));
    gulp.watch('src/js/**/*.js', gulp.series('webpack'));
  })
);

// Сборка без запуска сервера
gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel('html', 'php', 'styles', 'images', 'svg', 'fonts', 'webpack')
  )
);

// По умолчанию — сборка + сервер
gulp.task('default', gulp.series('build', 'server'));

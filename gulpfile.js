const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const browserSync = require('browser-sync')
const rollup = require('rollup');
const rollupCommonJs = require('@rollup/plugin-commonjs');
const rollupNodeResolve = require('@rollup/plugin-node-resolve');
const rollupBabel = require('rollup-plugin-babel');
const rollupTerser = require('@rollup/plugin-terser')
const replace = require('gulp-replace')

// konfiguracja ścieżek do plików
const paths = {
  scripts: {
    watch: 'src/js/**/*.js',
    src: 'src/js/index.js',
    dest: 'dist/js/'
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  }
}

gulp.task('scripts', function() {
  return rollup.rollup({
    input: paths.scripts.src,
    plugins: [
      rollupBabel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env'],
        babelrc: false
      }),
      rollupCommonJs(),
      rollupNodeResolve(),
      rollupTerser()
    ]
  }).then(function(bundle) {
    return bundle.write({
      file: paths.scripts.dest + 'main-bundle.min.js',
      format: 'iife',
      sourcemap: true
    });
  });
});

// zadanie budowania styli CSS
gulp.task('styles', function() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
    .pipe(replace('../../../dist', '../'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
})
gulp.task('styles-dev', function() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
})

// zadanie obserwowania zmian w plikach
gulp.task('watch', function() {
  gulp.watch(paths.scripts.watch, gulp.series('scripts'))
  gulp.watch(paths.styles.src, gulp.series('styles-dev'))
})

gulp.task('build', gulp.parallel('scripts', 'styles'))

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(paths.scripts.watch, gulp.series('scripts'));
  gulp.watch(paths.styles.src, gulp.series('styles-dev'));

  gulp.watch(['./*.html', 'dist/**/*']).on('change', browserSync.reload);
});
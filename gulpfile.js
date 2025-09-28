const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');


function compileSass() {
    const sassOptions = {
        includePaths: ['node_modules']
    };

    return src('web/assets/sass/theme.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('web/assets/css'));
}

function minifyCSS() {
    return src('web/assets/css/style.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(concat('style.min.css'))
        .pipe(dest('web/assets/css'));
}

function watchFiles() {
    watch('web/assets/sass/**/*.scss', series(compileSass, minifyCSS));
}

exports.sass = series(compileSass, minifyCSS);
exports.watch = series(compileSass, minifyCSS, watchFiles);
exports.default = exports.watch;
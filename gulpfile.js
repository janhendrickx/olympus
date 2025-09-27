const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-dart-sass'); // Gebruik gulp-dart-sass om de Legacy API te vermijden
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const path = require('path');

// // Pad naar je SSL-certificaat en sleutel (pas deze paden aan naar je eigen certificaten)
// const certPath = path.join('/Applications/ServBay/ssl/private/tls-certs/eskobar.local', 'eskobar.local.crt');
// const keyPath = path.join('/Applications/ServBay/ssl/private/tls-certs/eskobar.local', 'eskobar.local.key');

// Compile Sass naar CSS
function compileSass() {
    const sass = require('gulp-dart-sass');
    console.log('Loaded gulp-dart-sass version:', sass.compiler.info);
    

    return src('web/assets/sass/theme.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(concat('style.css'))
        .pipe(dest('web/assets/css'))
        .pipe(browserSync.stream());
}

// Minify CSS
function minifyCSS() {
    return src('web/assets/css/style.css', { allowEmpty: true })
        .pipe(cleanCSS({ compatibility: 'ie8' }).on('error', (err) => {
            console.error('Error in clean-css:', err.message);
        }))
        .pipe(concat('style.min.css'))
        .pipe(dest('web/assets/css'));
}

// Watch voor wijzigingen
function watchFiles() {
    watch('web/assets/sass/**/*.scss', series(compileSass, minifyCSS)); // Genereert style.css en min.css
    watch('web/assets/css/style.min.css').on('change', browserSync.reload); // Alleen minified bestand monitoren
}

// Default task
exports.default = series(
    parallel(compileSass, minifyCSS),
    watchFiles
);
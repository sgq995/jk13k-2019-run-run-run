const gulp = require('gulp');
const jshint = require('gulp-jshint');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const zip = require('gulp-zip');

const js = 'src/index.js';
const html = 'src/index.html';
const images = 'assets/*.png';

const outputDir = 'public/';

const jsOutputFilename = 'game.js';
const htmlOutputFilename = 'index.html';

function jsBuild(cb) {
    return gulp.src(js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(webpack({
            mode: 'production',
            
            output: {
                filename: jsOutputFilename
            }
        }))
        .pipe(babel())
        // .pipe(uglify())
        .pipe(gulp.dest(outputDir));
}

function jsBuildDev(cb) {
    return gulp.src(js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: jsOutputFilename
            }
        }))
        .pipe(gulp.dest(outputDir));
}

function htmlMinify(cb) {
    return gulp.src(html)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(outputDir));
}

function htmlMinifyDev(cb) {
    return gulp.src(html)
        .pipe(htmlmin({
            removeComments: true
        }))
        .pipe(gulp.dest(outputDir));
}

const build = gulp.parallel(jsBuild, htmlMinify);

const buildDev = gulp.parallel(jsBuildDev, htmlMinifyDev);

function watch(cb) {
    gulp.watch('src/*.js', jsBuild);
    gulp.watch('src/*.html', htmlMinify);
}

const publish = gulp.series(gulp.parallel(jsBuild, htmlMinify), (cb) => {
    return gulp.src([`${outputDir}${jsOutputFilename}`, `${outputDir}${htmlOutputFilename}`])
        .pipe(zip('release.zip'))
        .pipe(gulp.dest('build'));
});

exports.default = build;
exports.build = build;
exports.buildDev = buildDev;
exports.watch = watch;
exports.publish = publish;

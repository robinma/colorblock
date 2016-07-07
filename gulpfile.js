/**
 * @file colorBlock
 */

const gulp = require('gulp');
const rollup = require('gulp-rollup');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
// const babel = require('gulp-babel');

const gulpBrowser = require("gulp-browser");
var transforms = [
    {
        transform: "babelify",
        options: { presets: ["es2015"] }
    }
];

// 
gulp.task('bundle', () => {
    gulp.src('dev/**/*.main.js')
        .pipe(rollup())
        .pipe(gulpBrowser.browserify(transforms))
        .pipe(gulp.dest('dest/'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dest/'));

    gulp.src(['dev/modules/gpc.js', 'dest/index.main.js'])
        .pipe(concat('colorblock.js'))
        .pipe(gulp.dest('dest/'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dest/'));
});

// watch
gulp.task('watch', () => {
    gulp.watch('dev/**/*', ['bundle']);
});

// default task
gulp.task('default', ['bundle', 'watch']);


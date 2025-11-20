const gulp = require('gulp');

function buildIcons() {
  return gulp
    .src('nodes/**/*.{png,svg}', { base: './' })
    .pipe(gulp.dest('dist'));
}

exports.build = buildIcons;
exports['build:icons'] = buildIcons;
exports.default = buildIcons;

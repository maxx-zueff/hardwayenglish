const gulp = require('gulp');
const sass = require('gulp-sass');
// const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');

let paths = {
	input: {
		style: './assets/styles/common.scss',
		styles: './assets/styles/**/*.scss',
		imgs: './assets/images/*.{png,gif,jpeg,svg}',
		fonts: './assets/fonts/**/*.ttf'
	},
	output: {
		styles: './public/css',
		imgs: './public/images',
		fonts: './public/fonts/'
	}
};

gulp.task('sass', function() {
	return gulp.src(paths.input.style)
		.pipe(sass()
		// .pipe(sass({outputStyle: 'compressed'})
			.on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.output.styles));
});

gulp.task('watchs', function() {
	return gulp.watch(paths.input.styles, gulp.series('sass'))
		.on('all', function(event, path, stats) {
			console.log('File ' + path + ' was ' + event + ', running tasks...');
		});
});

gulp.task('img', function() {

	return gulp.src(paths.input.imgs)
		.pipe(gulp.dest(paths.output.imgs));
});

gulp.task('fonts', function() {

	return gulp.src(paths.input.fonts)
		.pipe(gulp.dest(paths.output.fonts));
});

gulp.task('default',
	gulp.series('img', 'fonts', 'sass', 'watchs'));
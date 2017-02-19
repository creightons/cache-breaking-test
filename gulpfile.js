const gulp = require('gulp'),
	rename = require('gulp-rename'),
	gutil = require('gulp-util'),
	sourcemaps = require('gulp-sourcemaps')
	browserify = require('browserify'),
	uglify = require('gulp-uglify'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	plumber = require('gulp-plumber'),
	cleanCSS = require('gulp-clean-css'),
	sass = require('gulp-sass'),
	{
		cssBuildName,
		jsBuildName,
	} = require('./config');
	
const jsSourcePath = 'frontend/js/index.js',
	cssSourcePath = 'frontend/scss/index.scss',
	cssWatchPath = 'frontend/scss/*.scss',
	buildPath = 'public',
	assetPaths = ['public/build.js', 'public/index.css'];


gulp.task('build:js', function() {
	return browserify(jsSourcePath)
		.bundle()
		.pipe(source(jsBuildName))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(buildPath));
});

gulp.task('build:css', function() {
	return gulp.src(cssSourcePath)
		.pipe(plumber())
		.pipe(sass())
		.pipe(cleanCSS())
		.pipe(rename(cssBuildName))
		.pipe(gulp.dest(buildPath));
});

gulp.task('sass', function() {
	return gulp.src(cssSourcePath)
		.pipe(plumber())
		.pipe(rename(cssBuildName))
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(buildPath));
});

gulp.task('watch:sass', function() {
	gulp.watch(cssWatchPath, ['sass']);
});


gulp.task('watch:js', function() {
	const bundler = watchify(
		browserify(
			{
				entries: jsSourcePath,
				debug: true,
			},
			watchify.args
		)
	);
	
	bundler.on('update', rebundle);
	
	function rebundle() {
		const start = Date.now();
		return bundler.bundle()
			.on('error', function(err) {
				gutil.log(
					gutil.colors.red(err.toString())
				);
			})
			.on('end', function() {
				gutil.log(
					gutil.colors.green(
						'Finished rebundling in ', (Date.now() - start) + 'ms'
					)
				);
			})
			.pipe(source(jsBuildName))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(buildPath));
	}
	
	return rebundle();
});


gulp.task('build', ['build:css', 'build:js']);

gulp.task('watch', ['sass', 'watch:sass', 'watch:js']);

gulp.task('default', ['watch']);
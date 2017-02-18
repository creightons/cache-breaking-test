const gulp = require('gulp'),
	gutil = require('gulp-util'),
	sourcemaps = require('gulp-sourcemaps'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass');
	
const jsSourcePath = 'frontend/js/index.js',
	jsBuild = 'build.js',
	jsBuildPath = 'public/',
	cssSourcePath = 'frontend/scss/index.scss',
	cssWatchPath = 'frontend/scss/*.scss',
	cssBuildPath = 'public';

gulp.task('sass', function() {
	return gulp.src(cssSourcePath)
		.pipe(plumber())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(cssBuildPath));
});

gulp.task('buildjs', function() {
	return browserify({
		entries: jsSourcePath,
		debug: true
	})
		.bundle()
		.pipe(source(jsBuild))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(jsBuildPath));
});

gulp.task('watchjs', function() {
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
			.pipe(source(jsBuild))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(jsBuildPath));
	}
	
	return rebundle();
});

gulp.task('watchsass', function() {
	gulp.watch(cssWatchPath, ['sass']);
});

gulp.task('build', ['sass', 'buildjs']);

gulp.task('watch', ['build', 'watchsass', 'watchjs']);

gulp.task('default', ['watch']);
const gulp = require('gulp');
const htmlclean = require('gulp-htmlclean');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const jsmin = require('gulp-jsmin');

const browserSync = require('browser-sync');
const compress = require('compression');
const reload = browserSync.reload;


const bases = {
	src: 'src/',
	dist: 'dist/'
};

const paths = {
	static: {
		images: 'img/*.jpg',
		icons: 'img/icons/*.png',
		manifest: 'manifest.json'
	},
	js_all: '**/*.js',
	js: {
		static: ['js/dbhelper.js', 'js/lazysizes.min.js', 'js/load_sw.js'],
		main: 'js/main.js',
		restaurant: 'js/restaurant_info.js',
		sw: 'sw.js',
		idb: 'js/idb.js'
	},
	css: 'css/*.css',
	html: '*.html'
}

gulp.task('html', function () {
	return gulp.src(paths.html, { cwd: bases.src })
		.pipe(htmlclean())
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(bases.dist))
		.pipe(reload({ stream: true }));
});

gulp.task('css', function () {
	return gulp.src(paths.css, { cwd: bases.src })
		.pipe(cleanCSS())
	    .pipe(gulp.dest(bases.dist + 'css/'))
	    .pipe(reload({ stream: true }));
});

// https://stackoverflow.com/a/38631463/2295672
function jsTask(src, name, out_dir){
	return gulp.src(src, { cwd: bases.src })
		.pipe(concat(name))
		.pipe(gulp.dest(bases.dist + out_dir))
		.pipe(jsmin())
		.pipe(gulp.dest(bases.dist + out_dir))
		.pipe(reload({ stream: true }));
}

gulp.task('js_main', function () {
	return jsTask([...paths.js.static, paths.js.main], 'main.js', 'js/');
});

gulp.task('js_restaurant', function () {
	return jsTask([...paths.js.static, paths.js.restaurant], 'restauran.js', 'js/');
});

gulp.task('sw', function () {
	return jsTask([paths.js.idb, paths.js.sw], 'sw.js', '');
});

gulp.task('js', ['js_main', 'js_restaurant', 'sw']);

function staticTask(src, out_dir) {
	return gulp.src(paths.static[src], { cwd: bases.src })
		.pipe(gulp.dest(bases.dist + out_dir));
}

gulp.task('images', function() {
	return staticTask('images', 'img/');
});

gulp.task('icons', function () {
	return staticTask('icons', 'img/icons/');
});

gulp.task('manifest', function () {
	return staticTask('manifest', '');
});

gulp.task('static', ['images', 'icons', 'manifest']);

gulp.task('build', ['html', 'css', 'js', 'static']);

gulp.task('serve', ['build'], (() => {
	browserSync.init({
		server: {
			baseDir: bases.dist,
			middleware: [compress()]
		}, ui: {
			port: 8000
		}, port: 8000
	});
}));

gulp.task('watch', ['serve'], function () {
	gulp.watch(paths.html, { cwd: bases.src }, ['html']);
	gulp.watch(paths.css, { cwd: bases.src }, ['css']);
	gulp.watch(paths.js_all, { cwd: bases.src }, ['js']);
});

gulp.task('default', ['watch']);

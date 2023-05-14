/**
 * Gulp tasks
 */

const fs = require('fs');
const gulp = require('gulp');
const replace = require('gulp-replace');
const terser = require('gulp-terser');
const cssnano = require('gulp-cssnano');

const locales = require('./locales');
const meta = require('./package.json');

gulp.task('copy:backend:main:views', () =>
	gulp.src('./packages/backend/src/servers/main/web/views/**/*').pipe(gulp.dest('./packages/backend/built/servers/main/web/views'))
);

gulp.task('copy:backend:v12c:simple-auth', () =>
	gulp.src('./packages/backend/src/servers/v12c/simple-auth-client/**/*').pipe(gulp.dest('./packages/backend/built/servers/v12c/simple-auth-client'))
);


gulp.task('copy:client:fonts', () =>
	gulp.src('./packages/client/node_modules/three/examples/fonts/**/*').pipe(gulp.dest('./built/_client_dist_/fonts/'))
);

gulp.task('copy:client:fontawesome', () =>
	gulp.src('./packages/client/node_modules/@fortawesome/fontawesome-free/**/*').pipe(gulp.dest('./built/_client_dist_/fontawesome/'))
);

gulp.task('copy:client:locales', cb => {
	fs.mkdirSync('./built/_client_dist_/locales', { recursive: true });

	const v = { '_version_': meta.version };

	for (const [lang, locale] of Object.entries(locales)) {
		fs.writeFileSync(`./built/_client_dist_/locales/${lang}.${meta.version}.json`, JSON.stringify({ ...locale, ...v }), 'utf-8');
	}

	cb();
});

gulp.task('build:backend:main:script', () => {
	return gulp.src(['./packages/backend/src/servers/main/web/boot.js', './packages/backend/src/servers/main/web/bios.js', './packages/backend/src/servers/main/web/cli.js'])
		.pipe(replace('LANGS', JSON.stringify(Object.keys(locales))))
		.pipe(terser({
			toplevel: true
		}))
		.pipe(gulp.dest('./packages/backend/built/servers/main/web/'));
});

gulp.task('build:backend:main:style', () => {
	return gulp.src(['./packages/backend/src/servers/main/web/style.css', './packages/backend/src/servers/main/web/bios.css', './packages/backend/src/servers/main/web/cli.css'])
		.pipe(cssnano({
			zindex: false
		}))
		.pipe(gulp.dest('./packages/backend/built/servers/main/web/'));
});

// gulp.task('build:backend:v12c:script', () => {
// 	return gulp.src(['./packages/backend/src/servers/v12c/web/boot.js', './packages/backend/src/servers/v12c/web/bios.js', './packages/backend/src/servers/v12c/web/cli.js'])
// 		.pipe(replace('LANGS', JSON.stringify(Object.keys(locales))))
// 		.pipe(terser({
// 			toplevel: true
// 		}))
// 		.pipe(gulp.dest('./packages/backend/built/servers/v12c/web/'));
// });

// gulp.task('build:backend:v12c:style', () => {
// 	return gulp.src(['./packages/backend/src/servers/v12c/web/style.css', './packages/backend/src/servers/v12c/web/bios.css', './packages/backend/src/servers/v12c/web/cli.css'])
// 		.pipe(cssnano({
// 			zindex: false
// 		}))
// 		.pipe(gulp.dest('./packages/backend/built/servers/v12c/web/'));
// });

// gulp.task('build:backend:v12c:miauth:script', () => { // TODO: このへんよくわからずに書いてるので完全に理解する
// 	return gulp.src(['./packages/backend/src/servers/v12c/miauth-client/script.js'])
// 		.pipe(terser({
// 			toplevel: true
// 		}))
// 		.pipe(gulp.dest('./packages/backend/built/servers/v12c/miauth-client/'));
// });

// gulp.task('build:backend:v12c:miauth:style', () => {
// 	return gulp.src(['./packages/backend/src/servers/v12c/miauth-client/style.css'])
// 		.pipe(cssnano({
// 			zindex: false
// 		}))
// 		.pipe(gulp.dest('./packages/backend/built/servers/v12c/miauth-client/'));
// });

gulp.task('build', gulp.parallel(
	'copy:client:locales', 'copy:backend:main:views', 'copy:backend:v12c:simple-auth', 'build:backend:main:script', 'build:backend:main:style', 'copy:client:fonts', 'copy:client:fontawesome'
));

gulp.task('default', gulp.task('build'));

gulp.task('watch', () => {
	gulp.watch([
		'./packages/*/src/**/*',
	], { ignoreInitial: false }, gulp.task('build'));
});

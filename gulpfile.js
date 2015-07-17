// --------------MODULOS-------------------
var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	jade = require('gulp-jade'),
	stylus = require('gulp-stylus'),
	nib = require('nib'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	webserver = require('gulp-webserver'),
	opn = require('opn');

//Transferir bootstrap a las librerias styl usar    gulp transferencia
gulp.task('transferir', function(){
	gulp.src('./node_modules/bootstrap-styl/bootstrap/**/*.styl')
		.pipe(gulp.dest('componentes/lib/stylusbootstrap'));
	gulp.src('./node_modules/bootstrap-styl/js/*.js')
		.pipe(gulp.dest('componentes/lib/jsbootstrap'));
	gulp.src('./node_modules/bootstrap-styl/fonts/*.*')
		.pipe(gulp.dest('./public/font'));
})

// --------------LINKS-------------------
// variables de los links de las carpetas.
var path = {
    jade: ['componentes/jade/**/*.jade'],
    html: 'public',
    stylus: ['componentes/stylus/*.styl'],
    css: 'public/css',
    script: ['componentes/scripts/**/*.js'],
    coffee: ['componentes/coffee/**/*.coffee'],
    js: 'componentes/scripts',
    pruebajs: 'componentes/prueba/*.coffee',
    server: {
        host: 'localhost',
        port: '3000',
        path: '/public'
    },
};

/*******************************************************************************
 *  Webserver up and running
 */
gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            host: path.server.host,
            port: path.server.port,
            livereload: true,
            directoryListing: false
        }));
});

/*******************************************************************************
 *  Abrir el Navegador
 */
gulp.task('openbrowser', function() {
    opn('http://'+ path.server.host +':'+ path.server.port + path.server.path);
});

// --------------JADE-------------------
//pretty: true (sin comprimir html) o false (comprimir html).
gulp.task('jade2html', function(){
	gulp.src(path.jade)
		.pipe(plumber())
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(path.html));
});

// --------------STYLUS-------------------
// use: nib() es para activar nib, 
// import: ['nib'] es para no tener que llamarlo directamente en la hoja styl, 
// compress es el tipo de compresion.
gulp.task('stylus2css', function(){
	gulp.src(path.stylus)
		.pipe(plumber())
		.pipe(stylus({
			use: nib(),
			import: ['nib'],
      		compress: false
		}))
		.pipe(gulp.dest(path.css));
});

// --------------COFFEESCRIPT-------------------
gulp.task('coffee2js', function(){
	gulp.src(path.coffee)
	.pipe(plumber())
	.pipe(coffee({
		bare: true
	}))
	.pipe(gulp.dest(path.js))
});

// -------------PRUEBA2JS----------------------
gulp.task('prueba2js', function(){
	gulp.src(path.pruebajs)
	.pipe(plumber())
	.pipe(coffee({
		bare: true
	}))
	.pipe(gulp.dest('public/js'))
});

// --------------JS-------------------
// .pipe(concat('script.js')) hace referencia al archivo final de js
// .pipe(uglify()) minimiza el archivo final de js
gulp.task('unirjs', function(){
	gulp.src(path.script)
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'))
});

// --------------WATCH-------------------
gulp.task('watch', function(){
	gulp.watch(path.jade, ['jade2html']);
	gulp.watch(path.stylus, ['stylus2css']);	
	gulp.watch(path.coffee, ['coffee2js']);	
	gulp.watch(path.pruebajs, ['prueba2js']);	
	gulp.watch(path.script, ['unirjs']);	
});

// --------------DEFAULT-------------------
gulp.task('default', ['watch', 'jade2html', 'stylus2css', 'coffee2js', 'prueba2js', 'transferir', 'webserver', 'openbrowser']);
'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSyncLib = require('browser-sync');
var minimist = require('minimist');
var wrench = require('wrench');
var config = require('./config/index');
var builds = require('./config/builds');
var path = require('path');
var sequence = require('run-sequence');
var colors = require('colors');

// Load all gulp plugins based on their names
// EX: gulp-copy -> copy
var plugins = gulpLoadPlugins();

var runtime = {};

//--------------------- CLI arguments -----------------------------------
var args = minimist(process.argv.slice(2));

runtime.widget = args.w || args.widget || null;
if (runtime.widget === null) {
    console.error(
        "Please specify a widget to build (-w name  OR --widget name)"
            .red.bold
    );
    process.exit();
}

runtime.build = args.b || args.build || 'default'; //'default' by default

if (! builds[runtime.build]){
    console.error(
        ("Build configuration for '" + runtime.build +
        "' not found, check config/builds.js").red.bold);
    process.exit();
}

runtime.debug = !!(args.debug || args.dbg || false);

runtime.production = args.production || args.prod || args.p || null;

//-------------------------------------------------------------
var dirs = config.directories;

runtime.serverTarget = path.join(dirs.destination, dirs.server);
runtime.commonTarget = path.join(dirs.destination, dirs.common);
runtime.widgetsTarget = path.join(dirs.destination, dirs.widgets);
runtime.exactWidgetSource = path.join(dirs.widgetsSource, runtime.widget);
runtime.tempExactWidgetSource = path.join(dirs.tempWidgetsSource, runtime.widget);
runtime.exactWidgetTarget = path.join(runtime.widgetsTarget, runtime.widget);

// Create a new browserSync instance
runtime.browserSync = browserSyncLib.create();

// Add --debug option to your gulp task to view
// what data is being loaded into your templates
if (runtime.debug) {
    console.log('==== DEBUG ====');
    console.log('config', config);
    console.log('runtime', runtime);
}

//-------------------------------------------------------------------------
// This will grab all js in the `gulp` directory
// in order to load all gulp tasks
wrench.readdirSyncRecursive('./gulp').filter(function(file){
    return (/\.js$/i).test(file);
}).map(function (file) {
    require('./gulp/' + file)(gulp, plugins, config, runtime);
});


// Build production-ready code
gulp.task('build:common', function(cb){
    sequence(
        'clean:common',
        'copy:common',
        cb
    );
});

// Build production-ready code
gulp.task('build:client', ['build:common'], function(cb){
    sequence(
        'clean:client',
        'copy:client',
        'replace',
        'sass',
        'nunjucks',
        'copy:pages',
        cb
    );
});

// Build production-ready code
gulp.task('build:server', ['build:common'], function(cb){
    sequence(
        'clean:server',
        'copy:server',
        'replace',
        'copy:common:dist',
        'copy:server:dist',
        cb
    );
});

gulp.task('build', [
    'build:server',
    'build:client'
]);

// Default task
gulp.task('up', function(cb){
    sequence(
        'build:server',
        'gas:upload',
        cb
    );
});

// Server tasks with watch
gulp.task('serve', [
    'browserSync',
    'watch'
]);

// Default task - rebuild and serve
gulp.task('default', function(cb){
    sequence(
        'build',
        'serve',
        cb
    );
});


'use strict';

var path = require('path');
//import autoprefixer from 'autoprefixer';
var dbg = require('gulp-debug');

module.exports= function (gulp, plugins, config, runtime) {
    var dirs = config.directories;
    var dest = path.join(runtime.tempExactWidgetSource, '__gen');

    // Sass compilation
    gulp.task('sass', function() {
        var res = gulp.src([
                path.join(runtime.exactWidgetSource, '**/*.scss')
            ])
            .pipe(dbg({title: 'sass_before'}))
            //.pipe(plugins.plumber())
            //.pipe(plugins.sourcemaps.init())
            .pipe(
                plugins.sass({
                    outputStyle: 'expanded',
                    outFile: '__build/exact.css',
                    precision: 10,
                    includePaths: [
                        //allow to include scss from any place of client dir
                        path.join(dirs.source),
                    ]
                }).on('error', plugins.sass.logError)
            )
            .pipe(dbg({title: 'sass_after'}));
            //.pipe(plugins.postcss([autoprefixer({browsers: ['last 2 version', '> 5%', 'safari 5', 'ios 6', 'android 4']})]))
            if (runtime.production)
                res.pipe(plugins.cssnano({rebase: false}));
            //.pipe(plugins.sourcemaps.write('./'))
            return res.pipe(gulp.dest(dest));
            //.pipe(runtime.browserSync.stream({match: '**/*.css'}));
    });
}

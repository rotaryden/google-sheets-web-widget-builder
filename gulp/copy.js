'use strict';

var path = require('path');
//import merge from 'merge-stream';

module.exports= function (gulp, plugins, config, runtime) {
    var dirs = config.directories;

    // Copy
    gulp.task('copy:server', function() {
        return gulp.src(path.join(dirs.server, '**/*'))
            //.pipe(plugins.changed(runtime.serverTarget))
            .pipe(gulp.dest(path.join(dirs.tempServer)));
    });

    gulp.task('copy:client', function() {
        return gulp.src(path.join(dirs.client, '**/*'))
            //.pipe(plugins.changed(dirs.tempClient))
            .pipe(gulp.dest(path.join(dirs.tempClient)));
    });

    gulp.task('copy:common', function() {
        return gulp.src(path.join(dirs.common, '**/*'))
            //.pipe(plugins.changed(dirs.tempCommon))
            .pipe(gulp.dest(path.join(dirs.tempCommon)));
    });

    gulp.task('copy:pages', function() {
        return gulp.src(path.join(dirs.widgetsSource, '*.html'))
            //.pipe(plugins.changed(runtime.serverTarget))
            .pipe(gulp.dest(path.join(runtime.widgetsTarget)));
    });

    gulp.task('copy:server:dist', function() {
        return gulp.src([
                path.join(dirs.tempServer, '**/*')
            ])
            //.pipe(plugins.changed(runtime.serverTarget))
            .pipe(gulp.dest(path.join(runtime.serverTarget)));
    });

    gulp.task('copy:common:dist', function() {
        return gulp.src([
                path.join(dirs.tempCommon, '**/*')
            ])
            //.pipe(plugins.changed(runtime.serverTarget))
            .pipe(gulp.dest(path.join(runtime.commonTarget)));
    });
    // gulp.task('copy:client', function() {
    //     var s1 = gulp.src([
    //             path.join(dirs.client, '**/*'),
    //             path.join(dirs.common, '**/*'),
    //             //'!' + path.join(dirs.source, '**/*.nunjucks')
    //         ])
    //         //.pipe(plugins.changed(runtime.serverTarget))
    //         .pipe(gulp.dest(dirs.temporary));
    //     var s2 = gulp.src([
    //             path.join(dirs.client, '**/*'),
    //         ])
    //         .pipe(gulp.dest(dirs.temporary));
    //
    //     return merge(s1, s2)
    // });


}

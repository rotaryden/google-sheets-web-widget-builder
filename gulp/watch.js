'use strict';

var path = require('path');

module.exports= function (gulp, plugins, config, runtime) {
    var dirs = config.directories;

    // Watch task
    gulp.task('watch', function() {
        if (!runtime.production) {
            gulp.watch([
                path.join(dirs.client, '**/*'),
                path.join(dirs.common, '**/*'),
                path.join('config/builds.js')
            ], ['build:client']);

            gulp.watch([
                path.join(dirs.server, '**/*'),
                path.join(dirs.common, '**/*'),
                path.join('config/builds.js')
            ], ['build']);


            gulp.watch([
                path.join(runtime.widgetsTarget, '**/*'),
            ]).on('change', runtime.browserSync.reload);
        }
    });
}

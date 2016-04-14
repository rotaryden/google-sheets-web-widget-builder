'use strict';

module.exports= function (gulp, plugins, config, runtime) {
    // BrowserSync
    gulp.task('browserSync', function() {
        runtime.browserSync.init({
            open: 'local',
            startPath: config.baseUrl,
            port: config.port || 3000,
            server: {
                baseDir: runtime.widgetsTarget,
                routes: (function() {
                    var routes = {};

                    // Map base URL to routes
                    routes[config.baseUrl] = runtime.widgetsTarget;

                    return routes;
                })()
            }
        });
    });
}

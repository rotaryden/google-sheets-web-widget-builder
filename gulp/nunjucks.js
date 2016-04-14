'use strict';

var path = require('path');
var nunjucks = require('gulp-nunjucks-html');
var builds = require('../config/builds');
var dbg = require('gulp-debug');

module.exports= function (gulp, plugins, config, runtime) {
    var dirs = config.directories;
    var dest = path.join(runtime.exactWidgetTarget);
    var clientData = builds[runtime.build].clientData;
    clientData.widget = runtime.widget;

    // Nunjucks templates compilation
    gulp.task('nunjucks', function() {
        var res = gulp.src(
            path.join(runtime.tempExactWidgetSource, 'main.tpl.html')
            )
            //.pipe(plugins.changed(dest))
            //.pipe(plugins.plumber())
            .pipe(dbg({title: 'nunjucks_before'}))
            .pipe(plugins.data({
                config: config,
                debug: runtime.debug,
                data: clientData,
                serializedData: JSON.stringify(clientData)
            }))
            .pipe(nunjucks({
                    searchPaths: [path.join(dirs.temporary)],
                    ext: '.html'
                }).on('error', function (err) {
                    plugins.util.log(err);
                })
            )
            .pipe(plugins.rename(function (path) {
                path.basename = "index";
                path.extname = ".html"
              }));

        if (runtime.production) {
            res.pipe(plugins.htmlmin({
                collapseBooleanAttributes: true,
                conservativeCollapse: true,
                removeCommentsFromCDATA: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true
            }));
        }
        return res.pipe(gulp.dest(dest))
            .on('end', runtime.browserSync.reload);
    });
}

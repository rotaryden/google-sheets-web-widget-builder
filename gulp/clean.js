'use strict';

var path = require('path');
var del = require('del');

module.exports= function (gulp, plugins, config, runtime) {
    var dirs = config.directories;

    // Clean
    gulp.task('clean:client', del.bind(null, [
        path.join(dirs.tempClient),
        path.join(runtime.exactWidgetTarget),
    ]));
    gulp.task('clean:server', del.bind(null, [
        path.join(dirs.tempServer),
        path.join(runtime.serverTarget)
    ]));
    gulp.task('clean:common', del.bind(null, [
        path.join(dirs.tempCommon),
    ]));
}

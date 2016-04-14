'use strict';

var path = require('path');
var builds = require('../config/builds');


module.exports= function (gulp, plugins, config, runtime) {
    var dirs = config.directories;
    var dest = dirs.temporary;
    var replaceData = builds[runtime.build].serverDefs;
    // Copy
    gulp.task('replace', function() {
        var st = gulp.src([
                path.join(dirs.tempServer, '**/*'),
                path.join(dirs.tempCommon, '**/*')
            ]);
            console.log(replaceData);
            for(var def in replaceData){
                st = st.pipe(plugins.replace('##\:' + def + '##', replaceData[def]))
            }
            //TODO: make replace to work with parameter mapping object from config rather then hardcoded

            return st.pipe(gulp.dest(dest));
    });
}

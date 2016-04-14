'use strict';

var exec = require('child_process').exec;

module.exports= function (gulp, plugins, config, runtime) {
    var dirs = config.directories;

    // Copy
    gulp.task('gas:upload', function (cb) {
        exec('gas upload -c ./gas-credential.json -s ./gas-project.json',
            function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                cb(err);
            }
        );
    });

}

module.exports= {
    //Local Server Settings",
    "host": "127.0.0.1",
    "port": "3000",
    "baseUrl": "./",

    directories: {
        source: './',
        server: "server",
        common: "common",
        client: "client",
        widgets: "widgets",
        widgetsSource: 'client/widgets',
        
        tempWidgetsSource: '__tmp/client/widgets',
        tempClient: '__tmp/client',
        tempServer: '__tmp/server',
        tempCommon: '__tmp/common',

        destination: "__build",
        temporary: "__tmp",
    },

    // "Entry files",
    entries: {
        "js": "main**.js",
        "css": "main**.{sass,scss}"
    }
}

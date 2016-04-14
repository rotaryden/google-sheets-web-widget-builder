function doGet(request) {
    //lazy loading global singletones - will evaluate only on get() methods
    var urlParams = request.parameter;
    var r = new Lib.ContentRenderer({}, urlParams.jsonpCallback);

    try {
        var conf;
        if (typeof urlParams.conf !== "undefined"){
            //to just avoid conf parsing from the PARAMS sheet if not needed,
            //pass conf=0 for example
            conf = urlParams.conf;
        }else{
            var configurator = new Common.Configurator(ssPool, CONSTANTS.configurator);
            conf = configurator.get();
        }

        //var auth = new Lib.Auth(conf);

        //check for strangers
        //TODO make new Auth for Content Service
        //if (!auth.validate()) {
        //    //get back with raw page, not rendering our styles and components for strangers
        //    return r.render({}, 'service_access-denied')
        //}

        var widget = urlParams.widget;

        var ctl = controllers[widget];

        if (ctl){
            var res = ctl(conf, urlParams);
            return r.render(res.data, res.error);
        } else {
            return r.render({}, "API method for the passed widget not found: " + widget);
        }

    }catch(e){
        return r.systemError(e);
    }
}

function doPost(request){
    //dummy stub for now
    return doGet(request);
}


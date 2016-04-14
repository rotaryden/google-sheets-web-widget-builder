var options = {};

(function() {
    var _urlParams = getUrlParams();
    options = _.assign(options, _urlParams);
    options.service_url = _urlParams.dev ?
        GlobalConfig.serviceUrl.development : GlobalConfig.serviceUrl.production;
})();

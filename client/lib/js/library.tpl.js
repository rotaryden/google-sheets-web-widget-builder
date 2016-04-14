function getUrlParams() {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    var urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);

    return urlParams;
}

//=====================================================================================================
//********************************************************************************************************************
function stub(){}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function trim(s) {
    return s.replace(/\s* (.*)\s*/, '$1');
}

function escapeRegExp(str) {
       return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function seekColumn(patterns, columnIndex0, rangeValues, searchAll){
    var results = [];
    for (var i = 0; i < patterns.length; i++) {
        var pattern = patterns[i];
        var rowNum = rangeValues.length;
        var re = new RegExp(escapeRegExp(pattern.toString().trim()), 'i');
        for (var rowi = 0; rowi < rowNum; rowi++) {
            if (rangeValues[rowi][columnIndex0].toString().search(re) !== -1) {
                if (! searchAll){
                    return rowi;
                }else{
                    results.push(rangeValues[rowi]);
                }
            }
        }
    }
    return results.length > 0 ? results : -1;
}

function getColumn(values, index){
    var res = [];
    for (var i = 0; i < values.length; i++) {
        res.push(values[i][index]);
    }
    return res;
}

function pickRows(priceArray, indexes){
    var res = [];
    for (var i = 0; i < indexes.length; i++) {
        res.push(priceArray[parseInt(indexes[i])]);
    }
    return res;
}

function makeSelectOptions(values, texts) {
    return _.map( (texts ? texts : _.uniq(values)) , (texts ? function (txt, i) {
        return {value: (values === "number" ? i : values[i]), text: txt};
    } : function (val) {
        return {value: val, text: val};
    }));
}

function numberify(s){
    return _.map(s.split(','), function(n){ return parseInt(n)})
}

function letterToColumn(letter) {
    var num = parseInt(letter);
    if (! isNaN(num)) return num;

    var column = 0, length = letter.length;
    for (var i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
}

//********************************************************************************************************************
//*************************************************************************************************

function Control(selector, options, manager){
    var t = this;
    t.manager = manager;
    t.preparedData = {};

    t.prepare = function(){
        if (options.depends)
        (options.prepareData || stub)();
    };

    t.preChange = options.preChange || stub;

    t.change = function (value) {
        if (typeof value !== "undefined"){
            t.set(value);
        }
        t.manager.preCall();
        t.preChange();
        if (options.apiAction) {
            t.manager.apiCall(options.apiAction, function (serverData) {
                t.preparedData = t.prepareData(serverData);
            });
        }
    };


    t.element = $(selector).selectize($.extend({}, {
        valueField: 'value',
        labelField: 'text',
        searchField: ['text'],
        sortField: 'text',
        onChange: function() { t.change(); }
    }, options.impl));

    t.impl = t.element[0].selectize;
}

Control.prototype.load = function (loadData) {
    var t = this;
    t.impl.load(function (callback) {
        callback(loadData);
        //control.setValue(value, true);
    });
};

Control.prototype.set = function (value) {
    this.impl.setValue(value, true);
};

Control.prototype.clear = function () {
    this.preparedData = {};  //clean render data
    this.impl.clear(true); //no onChange event
};

Control.prototype.get = function () {
    return this.impl.getValue();
};

Control.prototype.getPreparedData = function () {
    return this.preparedData;
};

Control.prototype.getAll = function () {
    return _.keys(this.impl.options);
};
//***********************************************************************************************************************************
//***********************************************************************************************************************************


function ControlManager(APIImplementation, preCall, render) {
    var t = this;
    t.controls = {};
    t.APIImplementation = APIImplementation;

    t.preCall = preCall;
    t.render = render;
}

ControlManager.prototype.make = function(name, selector, options){
    var t = this;
    t.controls[name] = new Control(selector, options, t);
};

ControlManager.prototype.getAllValues = function () {
    var t = this;
    var res = {};
    for (var name in t.controls) {
        res[name] = t.controls[name].get();
    }
    return res;
};

ControlManager.prototype.collectPreparedData = function () {
    var t = this;
    var res = {};
    for (var name in t.controls) {
        res[name] = t.controls[name].getPreparedData();
    }
    return res;
};

ControlManager.prototype.apiCall = function(action, callback){
    var t = this;

    t.APIImplementation(
        //implementation will use required ones
        $.extend({}, t.getAllValues(), {action: action}),
        function (serverData) {
            callback(serverData);
            t.render(t.collectPreparedData());
        }
    );

};

//*******************************************************************************************************************
//******************************************************************************************************************

var apiMapper = {
    service: function(payloadFactory){ return function (data, callback) {
        $.ajax({
            url: options.service_url,
            dataType: "jsonp",
            jsonp: "jsonpCallback",
            data: _.assign({widget: GlobalConfig.widget},
                payloadFactory(data)),
            success: function (response) {
                console.log(response);
                if (!response.error) {
                    callback(response.data);
                } else {
                    console.log('Error: ' + response.error)
                }
            }
        });
    }}
};

//************************************************************************************************
//*************************************************************************************************

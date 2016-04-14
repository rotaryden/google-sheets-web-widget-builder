var Common = (function(){
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    
//====================================================================================================
//====================================================================================================
    function ParamsDict(fields) {
        var t = this;
        t.fields = fields;
    }
    ParamsDict.prototype._getField = function(fieldName, fieldBody, values, offsets){
        var t = this;
        var spec = fieldBody.split(/\s*;\s*/);

        var row = parseInt(spec[0]) - 1 + offsets.row;
        var col = parseInt(spec[1]) - 1 + offsets.col;
        
        if (spec.length > 2){
            var dict = {};
            for(var j=2; j<spec.length; j++){
                if(spec[j]) {  //you can skip a column by giving empty name: 1;2;desc;;;val <-- [desc, '', '', val] 
                    dict[spec[j]] = values[row][col + j - 2];
                }
            }
            return dict;
        }else{
            return values[row][col];
        }
    };

    ParamsDict.prototype.get = function (values, offsets) {
        var t = this;
        offsets = offsets || {row: 0, col:0};
        
        var data = {};
        for (var fieldName in t.fields) {
            var val = t.fields[fieldName];
            if (isArray(val)){
                var results = [];
                for (var i=0; i<val.length; i++) {
                    results.push(t._getField(fieldName, val[i], values, offsets));
                }
                data[fieldName] = results;
            }else{
                data[fieldName] = t._getField(fieldName, val, values, offsets);
            }
        }
        return data;
    };
    
    
//====================================================================================================
//====================================================================================================
    
    function Configurator(ssPoolOrData, options, isClientSide){
        var t = this;
        t._opt = options;
        if (isClientSide){
            t._isClient = true;
            t._data = ssPoolOrData;
        }else {
            t._ssPool = ssPoolOrData;
        }
        t._params = null;

        t._handlers = {
            'string': function(val){return val.toString();},
            'integer': function(val){return parseInt(val);},
            'float': function(val){return parseFloat(val);},
            'JSON': function(val){return JSON.parse(val.toString());},
            'date': function(val){return new Date(val);},
            'list': function(val, splitter){
                return val.toString()
                    .split(makeRegex('\\s*', splitter, '\\s*'));
            },
            'array': function(val, terminator, row){
                return row.slice(0, row.indexOf(terminator || ""));
            }
        }
        
    }
    
    Configurator.prototype._getByType = function (row, value, atype, splitterOrTerminator) {
        return this._handlers[atype](value, splitterOrTerminator, row);
    };
    
    Configurator.prototype.get = function () {
        var t = this;
        if (t._params) {
            return t._params;
        } else {
            var res, values;
            if (t._isClient){
                values = t._data;
            }else{
                res = t._ssPool.get(t._opt.PARAMS_SPREADSHEET_ID, t._opt.PARAMETERS_SHEET_NAME);
                values = res.sheet.getDataRange().getValues();
            }
            var params = {};
            for (var i = t._opt.PARAM_ROWS_STARTS_FROM - 1; i < values.length; i++){
                var row = values[i];
                var name = row[t._opt.PARAM_NAME_POSITION - 1];
                if (name && ! /^\s*\/\//.test(name)) {   // '//' to comment'
                    walkNamespace(params, name,
                        t._getByType(
                            row.slice(t._opt.PARAM_VALUE_POSITION - 1),
                            row[t._opt.PARAM_VALUE_POSITION - 1],
                            row[t._opt.PARAM_TYPE_POSITION - 1],
                            row[t._opt.ITEMS_SPLITTER_POSITION - 1]
                        )
                    );
                }
            }
            t._params = params;
            
            return t._params;
        }
    };
    
    /**
     * Finds (and optionally creates) proper sub-object in the namespace base object by string path
     * @param  {Object} baseNS         Base object
     * @param  {string} namePathString like "A.B.C"m where C is a target name for value placing
     * @param {string} optValue   --- value to write, if it is specified, this is a write operation
     */
    function walkNamespace(baseNS, namePathString, optValue){

        var nameParts;

        if (namePathString.indexOf('...') !== -1) {
            if (namePathString.indexOf('...') === 0 && walkNamespace.lastNamePrefix) {
                nameParts = walkNamespace.lastNamePrefix.concat(namePathString.slice(3).split(/\s*\.\s*/));
            } else {
                throw Error('Wrong usage of "..." syntax ' +
                    'or no previous parameters with prefix occured: ' + namePathString);
            }
        } else {
            nameParts = namePathString.split(/\s*\.\s*/);
        }
        
        
        if (nameParts.length > 1){
            walkNamespace.lastNamePrefix = nameParts.slice(0, -1);
        }
        
        var part = baseNS;

        var l = nameParts.length; //edge case: l==1 (single name) - works as well

        for (var i=0; i < (l - 1); i++){
            //the next comparison works both for objects and arrays
            var key;
            if (isArray(part)){
                key = parseInt(nameParts[i]);
                if (isNaN(key)) return null; //just silently skip, arrays cannot contain keys for processing
                key = key - 1; //1-based indexes
            } else {
                key = nameParts[i]; //take it as string
            }
            
            if (typeof part[key] === "undefined"){
                if (typeof optValue !== "undefined"){
                    //this is a 'write' operation, add missing name chain here
                    //test the next chain if it is array index or object key
                    //so choose the type respectively
                    var num = parseInt(nameParts[i+1]);
                    part[key] = isNaN(num) ? {} : [];
                }else{
                    //there is no such entry
                    return null;
                }
            }
            part = part[nameParts[i]];
        }

        if (typeof optValue !== "undefined"){
            part[nameParts[l - 1]] = optValue
        }

        return part[nameParts[l - 1]];
    }
    
    walkNamespace.lastNamePrefix = null;
//====================================================================================================
//====================================================================================================
    return {
        ParamsDict: ParamsDict,
        Configurator: Configurator
    };
})();    


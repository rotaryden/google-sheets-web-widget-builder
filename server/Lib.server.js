var Lib = (function(){
    function stub() {return null};
    
    function uuid(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
    
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    
    function escapeRegExp(str) {
           return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    function makeRegex(pre, text, post) {
        return new RegExp(pre + escapeRegExp(text) + post);
    }
    
    function log(msg, data) {
        if (data) {
            Logger.log("\n\n" + msg + " ===> " + JSON.stringify(data) + "\n\n");
        }else{
            Logger.log("\n\n" + msg + "\n\n");
        }
    }

    function trace(err) {
        var errInfo = "\n";
        for (var prop in err) {
            errInfo += prop + ": " + err[prop] + "\n";
        }
        return errInfo;
    }
    
    /**
     * Extends or overwrites
     * @returns {*|{}}
     */
    function extend() {
        var destination = arguments[0] || {};
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            if (source) {
                for (var property in source) {
                    if (source.hasOwnProperty(property)) {
                        destination[property] = source[property];
                    }
                }
            }
        }
        return destination;
    }
    
    
    function columnToLetter(column) {
        if (typeof column === "string") return column;
        
        var temp, letter = '';
        while (column > 0) {
            temp = (column - 1) % 26;
            letter = String.fromCharCode(temp + 65) + letter;
            column = (column - temp - 1) / 26;
        }
        return letter;
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
    
    function appendRows(sheet, dataOrRowsNumber, optStartColumn, columnNameToScanForEndORstartRow) {
        var o = {};
        var max_rows = sheet.getMaxRows();
        var last_row = 1;
        if (typeof columnNameToScanForEndORstartRow !== UNDEF){
                if (typeof columnNameToScanForEndORstartRow === 'string') { //column name
                    var values = sheet.getRange(columnNameToScanForEndORstartRow + '1:' + columnNameToScanForEndORstartRow).getValues();
                    for (var r = values.length - 1; r >= 0; r--) {
                        if (values[r][0]) {
                            last_row = r + 1;
                            break;
                        }
                    }
                }else{ //should be a number
                    last_row = columnNameToScanForEndORstartRow;
                }
        } else {
            last_row = sheet.getLastRow();
        }
        
        var appendOnly = typeof dataOrRowsNumber === 'number';
        
        var l = appendOnly ? dataOrRowsNumber : dataOrRowsNumber.length;
        
        if (max_rows - last_row < l) {
            sheet.insertRowsAfter(max_rows, l - (max_rows - last_row) + 1);
            o.inserted = true;
        }
        
        if (! appendOnly) {
            var range = sheet.getRange(last_row + 1, optStartColumn || 1, dataOrRowsNumber.length, dataOrRowsNumber[0].length); //data should be normalized - all columns with the same size
            range.setValues(dataOrRowsNumber);
        }
        
        return o;
    }

    //====================================================================================================================================================
    function seekColumn(pattern, columnIndex0, rangeValues, searchAll){
        var results = [];
        if (pattern) {
            var colNum = rangeValues[0].length;
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

    multiLookup._getColumn = function(letter){
        return this.record[letterToColumn(letter)];
    };

    function getColumn(values, numberOrLetter, from){
        var index = letterToColumn(numberOrLetter) - 1;
        var res = [];
        for (var i = (from || 0); i < values.length; i++) {
            res.push(values[i][index]);
        }
        return res;
    }
    
    function lookup(pattern, rangeValuesForSearch, searchAll){
        var results = [];
        if (pattern) {
            var colNum = rangeValuesForSearch[0].length;
            var rowNum = rangeValuesForSearch.length;
            var re = new RegExp(escapeRegExp(pattern.toString().trim()), 'i')
            for (var coli = 0; coli < colNum; coli++) {
                for (var rowi = 0; rowi < rowNum; rowi++) {
                    if (rangeValuesForSearch[rowi][coli].toString().search(re) !== -1) {
                        if (! searchAll){
                            return rowi;
                        }else{
                            results.push(rowi);
                        }
                    }
                }
            }
        }
        return results.length > 0 ? results : -1;
    }

    multiLookup._getColumn = function(letter){
        return this.record[letterToColumn(letter)];
    };

    function multiLookup(patterns, columnsForPatternsToSearchOver, wholeDataRangeValues, searchAll){
        var results = [];
        var patternsMatchNumbers = {};
        
        var rowNum = wholeDataRangeValues.length;
        
        if (patterns) {
            var patternsNumber = patterns.length;
            
            for (var p = 0; p < patternsNumber; p++) {
                
                //take a particular range to search for a particular pattern
                //search wil be done in ALL columns for this particular pattern
                //typically, you'll want only one-column ranges for one pattern
                
                var columnForSearchIndex = letterToColumn(columnsForPatternsToSearchOver[p]); 
                
                var re = new RegExp(escapeRegExp(patterns[p].toString().trim()), 'i');
                
                for (var rowi = 0; rowi < rowNum; rowi++) {
                    if (wholeDataRangeValues[rowi][columnForSearchIndex].toString().search(re) !== -1) {
                        if (patternsMatchNumbers[rowi] &&                 //we already found some of patterns on this row 
                            (patternsMatchNumbers[rowi] + 1) === patternsNumber //so we have found already all patterns on this row including this one
                        ){
                            if (!searchAll) {
                                return { index: rowi, record: wholeDataRangeValues[rowi], get: multiLookup._getColumn};
                            } else {
                                results.push({ index: rowi, record: wholeDataRangeValues[rowi], get: multiLookup._getColumn});
                            }
                        } else {
                            //either no or not all patterns found on this row
                            patternsMatchNumbers[rowi] = (patternsMatchNumbers[rowi] || 0 /*"undefined" handling*/) + 1;
                        }
                    }
                }
            }
        }
        return results.length > 0 ? results : -1;
    }

    //====================================================================================================================
    function SSPool() {
        var t = this;
        t.error = null;
        t._ssSet = {};
    }

    SSPool.prototype.getOrCreate = function (ssId, sheetName, range) {
        return this._get(ssId, sheetName, range, true);
    };
    
    SSPool.prototype.get = function (ssId, sheetName, range) {
        return this._get(ssId, sheetName, range, false);
    };
    
    SSPool.prototype._get = function (ssId, sheetName, range, createSheetIfMissing) {
        var t = this;
        t.error = null;
        var ss;
        if (! (ssId in t._ssSet)){
            ss = SpreadsheetApp.openById(ssId);
            if (! ss) {
                t.error = "Wrong Spreadsheet ID: " + ssId;
                return null;
            }
            
            t._ssSet[ssId] = {
                ss: ss,
                sheets: {},
                ranges: {},
                sheet: null, //last fetched sheet
                range: null  //last fetched range
            };
        }else{
            ss = t._ssSet[ssId].ss;
        }
        if (sheetName) {
            var sheet = t._ssSet[ssId].sheets[sheetName];
            if (! sheet){
                sheet = ss.getSheetByName(sheetName);
                if (! sheet){
                    if(createSheetIfMissing){
                        sheet = ss.insertSheet(sheetName, 0);
                    }else {
                        t.error = "Wrong sheet name: " + sheetName;
                        return null;
                    }
                }
                t._ssSet[ssId].sheets[sheetName] = sheet;
            }
            t._ssSet[ssId].sheet = sheet;
        } else if (sheetName === ''){ //shortcut for the active sheet
            t._ssSet[ssId].sheet = ss.getActiveSheet();
        }
        if (range){
            t._ssSet[ssId].range = t._ssSet[ssId].sheet.getRange(range);                
        }
        return t._ssSet[ssId];
    };
    
    
    //========================================================================================================================
    function Auth(confInstance){
        var t = this;
        t._runningUser = Session.getActiveUser().getEmail();
        t._params = confInstance;
    }

    Auth.prototype.getEmail = function () {
        return this._runningUser;
    };
    
    Auth.prototype.validate = function (userEmail) {
        var t = this;
        
        var emailToCheck = userEmail ? userEmail : t._runningUser;
        
        //just need to check if user has access at all (is in ALL group)
        return t._params.role[CONSTANTS.ROLE_ALL].indexOf(emailToCheck) !== -1;

    };   
    
    Auth.prototype.validateRole = function (page, userEmail) {
        var t = this;
        
        var emailToCheck = userEmail ? userEmail : t._runningUser;
        
        //need to check permissions to this specific page
        //return after having found the first role permitting this page
        for (var role in CONSTANTS.ROLE) {
            //log('role', role);
            if (t._params.role[role].indexOf(emailToCheck) !== -1 &&
                CONSTANTS.ROLE[role].allowedPrefixes.indexOf(page.getPrefix()) !== -1 
            ){
                return true;
            }
        }
        
        return false;
    };
    
    
//====================================================================================================
//====================================================================================================

    function ContentRenderer(baseData, jsonpCallback){
        var t = this;
        t._jsonpCallback = jsonpCallback || 'callback';
        t._baseData = baseData || null;
    }

    ContentRenderer.prototype.render = function (data, error){
        var t = this;
        
        var result = {
            error: error ? error : false,
            data: t._baseData ? extend({}, t._baseData, data) : data,
            systemError: null
        };
        
        return t._respond(result);
    };

    ContentRenderer.prototype.systemError = function (exception) {
        var t = this;
        var tr = Lib.trace(exception);
        Logger.log(tr);
        var message = DEBUG ? tr.replace(/\n/g, '   ===>   ') : String(exception);
        var error = {
            error: "System error",
            data: {},
            systemError: message
        };
        
        return t._respond(error);
    };
    
    ContentRenderer.prototype._respond = function (what) {
        return ContentService.createTextOutput(this._jsonpCallback + '(' + JSON.stringify(what) + ')')
            .setMimeType(ContentService.MimeType.JAVASCRIPT);
    };
    
//====================================================================================================
//====================================================================================================
    return {
        stub: stub,
        isArray: isArray,
        isObject: isObject,
        extend: extend,
        SSPool: SSPool,
        Auth: Auth,
        log: log,
        trace: trace,
        ContentRenderer: ContentRenderer,
        seekColumn: seekColumn,
        lookup:lookup,
        multiLookup: multiLookup,
        getColumn: getColumn,
        letterToColumn: letterToColumn,
        columnToLetter: columnToLetter
    };
})();    

//lazy loading global singletones - will evaluate only on get() methods
var ssPool = new Lib.SSPool();

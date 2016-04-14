var controllers = (function () {
    //TODO old method, to be reused
    var fillComponentData = function(spreadsheetId, range, fields, params){
        if (! params.brand) return {error: "Empty dataSheet"};

        var res = ssPool.get(spreadsheetId, params.brand);
        if (ssPool.error) return {error: ssPool.error};

        var values = res.sheet.getRange(range).getValues();
        //TODO cache 'data' here
        return {data: new Common.ParamsDict(fields).get(values)};
    };

    //TODO old method to take variable configuration from notes on the sheet
    var getWidgetRangeAndNotes = function(spreadsheetId, range, params){
        if (! params.dataSheet) return {error: "Empty dataSheet"};

        var res = ssPool.get(spreadsheetId, params.dataSheet);
        if (ssPool.error) return {error: ssPool.error};

        var r = res.sheet.getRange(range);
        return {
            data: {
                values: r.getValues(),
                notes: r.getNotes()
            }
        }
    };

    /**
     * Reads spreadsheet urls from the sheet
     * extracts their ids
     * and fetches
     */
    var getSpreadsheets = function(ss, sheetName, namesColumn, idsColumn){
        var res = ssPool.get(ss, sheetName);
        if (ssPool.error) return {error: ssPool.error};
        var values = res.sheet.getDataRange().getValues();
        var urls = Lib.getColumn(values, idsColumn, 1);
        var _names = Lib.getColumn(values, namesColumn, 1);
        var ids = [];
        var names = [];
        var re = /.*\/spreadsheets\/d\/([\w\-]+)\/.*/;
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            if(url) {
                var result = re.exec(url);
                ids.push(result[1]);
                names.push(_names[i]);
            }
        }
        return {names: names, ids: ids }
    };

    return {
        pricing: function (conf, params) {
            var info;
            if (! params || ! params.range) {
                return {
                    error: "wrong action parameters"
                };
            }

            if (params.action === 'get_sheets') {
                if (! params.master_ss) {
                    info = ssPool.get(params.master_ss);
                    if (ssPool.error) return {error: ssPool.error};

                    var sheets = info.ss.getSheets();
                    var sheetNames = [];
                    for (var i = 0; i < sheets.length; i++) {
                        sheetNames.push(sheets[i].getName());
                    }

                    return {
                        error: null,
                        data: {
                            sheetNames: sheetNames
                        }
                    }
                } else {
                    return {
                        error: "Invalid supplied_id: " + params.master_ss
                    }
                }
            }


            else if (params.action === 'get_values') {
                if (! params.master_ss || ! params.sheet || ! params.range) {
                    info = ssPool.get(
                        params.master_ss, params.sheet, params.range);
                    if (ssPool.error) return {error: ssPool.error};

                    return {
                        error: null,
                        data: {
                            values: info.range.getValues()
                        }
                    }
                } else {
                    return {
                        error: "Invalid supplier ID or sheet name or range: "
                            + params.master_ss + ':' + params.sheets + ':' + params.range
                    }
                }
            }
        }

    }
})();


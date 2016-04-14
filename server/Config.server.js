DEBUG = false;
//CONSTANTS needs to be available where spreadsheet is not accessible (yet)
//cannot be moved to sheet-based parameters
var CONSTANTS = {
    configurator: {
        //Do NOT touch! Is replaced automatically by Gulp's replace task
        //see config/builds.js:serverDefs to change
        PARAMS_SPREADSHEET_ID: "##:paramsSpreadSheet##",
        PARAMETERS_SHEET_NAME: '##:paramsSheetName##',

        //======================================================================================
        //Indexes below counting from 1
        PARAM_NAME_POSITION: 1,
        PARAM_TYPE_POSITION: 2,
        ITEMS_SPLITTER_POSITION: 3,
        PARAM_VALUE_POSITION: 5,
        PARAM_ROWS_STARTS_FROM: 5
    },

    ROLE_ALL: 'ALL',

    ROLE:{
        admin: {
            name: 'admin',
            allowedPrefixes: ['admin','service','app']
        },
        staff:{
            name:'staff',
            allowedPrefixes: ['service','app']
        }
    }
};

var UNDEF = "undefined";

var vars = {
    paramsSpreadSheet: '1mol7bUbvYswqNXsMs8IKBdNT9V2yV6IEKc0N8mRyg-A'
};

//this is the parameter object we expose
module.exports= {
    //Builds configuration
    //this variables may be used in template conditions to
    //form different widget contents in different builds,
    //e.g. you need different code base for different clients
    //and don't want clients to see specific widget codes of each other
    //then you can just exclude it with condition
    //see pricing/body.tpl.html for example

    //first build names come. E.g. pricing_1
    //You may specify in command line
    // gulp build -w pricing -b pricing_1
    //it would command to build pricing widget with context taken from pricing_1
    //it takes 'default' config if no -b option given
    default: {
        //Server-only defines - will be injected into server code files (like macros)

        //Change of these will be applied to all widgets
        //after you rebuild and republish the API service
        serverDefs:{
            //This is a global spreadsheet with parameters,
            //change of it immediately affects the Apps Script service
            // all widgets and its instances
            // (unless you want have it different for different widgets)
            paramsSpreadSheet: vars.paramsSpreadSheet,
            paramsSheetName: 'PARAMS'
        },
        //Variables those will be visible
        // in client Javascript under GlobalConfig object,
        // and in Nunjucks templates as {{ data.varName }}, also in conditions etc
        //see Nunjucks template engine docs: https://mozilla.github.io/nunjucks/templating.html

        //Change of these will be applied only after widget rebuild and republish
        //on your website
        clientData:{
            serviceUrl: {
                development: "",
                production: ""
            },
        }
    },
    pricing_1: {
        serverDefs:{
            //This is a global
            paramsSpreadSheet: vars.paramsSpreadSheet,
            paramsSheetName: 'PARAMS'
        },
        clientData:{
            //Pricing widget uses single Spreadsheet with data
            masterSS: '1uDe6v9IHsg0s88qMKefVZfyDJ_WkwRYkkr_Gx6RcZPA',
            //This are urls for Apps Script published Service endpoints
            //to which Ajax calls will be passed from a widget
            //Development (updates on every upload)
            // and production (updates only on explicit version bump in an Apps Script project)
            serviceUrl: {
                development: "",
                production: ""
            },
            clientName: 'A-client'
        }
    }
}

//Default options specific to widget internal logic
//(Unlike more general ones placed in the config/builds.js)
//can be changed in URL parameters also
//Its up to you how to split your settings between these configuration means


//add default options only if not assigned yet
_.defaults(options, {
    //======================== parameters in the dropdowns ================================================
    //--------------- front-end only
    price_option: 1,

    number_of_products: 7,

    outlines: '5,7',

    master_ss: GlobalConfig.masterSS,
    //============================================== manual parameters ==================================
    //--- passed to back-end
    //excluded_sheet_names: ['G Codes'],

    range: "A2:L",  //header height = 1 row

    //----- front-end only
    price_option_default: 1,

    product_column: 1,
    price_start_column: 'D',
    price_options_number: 4,
    product_kinds_column: 'C',

    refreshInterval: "900", //15 minutes

    // ========================================== system parameters ========================================
    //service_url: can also be set via url parameters, would be as in GlobalConfig by default

    apiType: "service",
    method: "dynamic_widget"


    /*
    https://script.google.com/a/macros/sketchof.me/s/AKfycbxKzpxpSgANHn9isZ04MSpdJukyrPft6uBNov0e9ND-/dev?method=dynamic_widget&sheet=SUPERB&ss=1rPJQCMC7IJJ5ojlSNcnjFoEsZX8SPCZONiXQOfCH-Mk&range=A2:L&conf=0
     */

});


options.product_kinds = numberify(options.product_kinds);
options.outlines = numberify(options.outlines);

options.price_start_column = letterToColumn(options.price_start_column);
options.price_end_column = letterToColumn(options.price_end_column);
options.product_kinds_column = letterToColumn(options.product_kinds_column);


$(document).ready(function () {
    var env = new nunjucks.Environment(new nunjucks.WebLoader('', {}));

    var el = $('#tpl-pricing');
    var spinner = $("#spinner");

    el.on('click', '.print-me', function () {
        window.print();
    });

    var pricingTemplate = new nunjucks.Template(el.text(), env);

    var apiService = apiMapper[options.apiType](function(data){
        return {
            action: data.action,

            range: options.range,

            sheet: data.sheet,

            master_ss: options.master_ss,
            conf: 0  //skip parsing PARAMS from the sheet
        };
    });

    var cm = new ControlManager(
            apiService,
            function () {
                el.hide();
                spinner.show();
            },
            function (preparedData) {
                var renderData = renderHandler(preparedData);
                el.html(pricingTemplate.render(renderData));
                el.show();
                spinner.hide();
            }
    );

    var renderHandler = function(data){
        if (data.values) {
            //find rows with the current product only
            var rows = seekColumn([selected.product], options.product_column - 1, data.values, true);

            rows = seekColumn(selected.product_kinds, options.product_kinds_column - 1, rows, true);

            //console.log(rows);

            //                    var prices = pickRows(
            //                            getColumn(rows, (options.price_start_column - 1) + (options.price_option - 1)),
            //                            options.price_pickers
            //                    );

            var prices = getColumn(rows, (options.price_start_column - 1) + (selected.price_option - 1));

            //var descriptions = getColumn(rows, options.product_kinds_column - 1);

            var items = _.map(_.zip(prices, selected.product_kinds), function (arr, i) {
                return {
                    price: arr[0],
                    desc: arr[1],
                    outline: (selected.outlines.indexOf(i - 1) !== -1)
                }
            });

            return {
                items: items,
                product: selected.product
            };

        }
    };

    cm.make('category', '.select-category', {
        apiAction: "get_values",
        impl:{
            //items: options.sheet ? [options.sheet] : []
        },
        prepareData: function (data) {
            var sheets = _.difference(data.sheets, options.excluded_sheet_names);
            this.load(makeSelectOptions(sheets));

            return {};
        },
        preChange: function () {
            cm.controls.product.clear();
            cm.controls.product_kinds.clear();
            cm.controls.price_option.set(options.price_option_default);
        },
    });

    cm.make('product', '.select-product', {
        impl:{
            //items: options.product ? [options.product] : []
        },
        slaves: ['product_kinds'],
        prepareData: function (data) {
            var t = this;
            var products = makeSelectOptions(getColumn(data.values, options.product_column - 1));
            t.load(products);

            return {product: t.get()};

        },
        preChange: function () {
            cm.controls.product_kinds.clear();
        },
    });


    cm.make('price_option', '.select-price-option', {
        prepareData: function (data) {
            var price_options = data.values ? makeSelectOptions(
                    "number", data.values[0].slice(options.price_start_column - 1, options.price_end_column))
                    : null

        },
    });

    cm.make('outlines', '.select-outlined-rows', {
        impl:{
            closeAfterSelect: false,
            //maxItems:
        }
    });

    //cm.controls.product.change(); //trigger initial change to top-level selector with API call

    setInterval(function(){cm.controls.product.change();},
        parseInt(options.refreshInterval) * 1000);
});

const webpack = require('webpack');
const path = require('path');

module.exports = function (env) {

    // webpack --env.production
    if (!env) env = {
        dev: true
    };

    var config = {

        context: __dirname,

        entry: {
            'main':  './assets/core/main'
        },

        output: {
            path: path.resolve(__dirname, 'public/js'),
            filename: '[name].js'
        },

        watch: env.dev,

        watchOptions: {
            aggregateTimeout: 100
        },

        plugins: [
            new webpack.NoErrorsPlugin()
        ],

        devtool: 'source-map'
    };

    if (env.production) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    // don't show unreachable variables etc
                    warnings:     false,
                    drop_console: true,
                    unsafe:       true
                }
            })
        );
    }

    return config;

};
const webpack = require('webpack');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    entry: [
        'script!jquery/dist/jquery.min.js',
        './app/app.js',
    ],
    externals: {
        jquery: 'jQuery',
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    output: {
        path: __dirname,
        filename: './public/bundle.js',
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            },
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.scss?$/,
            loader: 'style!css!sass!'
        }, {
            test: /\.css?$/,
            loader: 'style!css'
        }]
    },
    devtool: process.env.NODE_ENV ? undefined : 'cheap-eval-source-map'
}

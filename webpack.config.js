const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: [
        'script!jquery/dist/jquery.min.js',
        './app/app.js',
    ],
    output: {
        path: (__dirname, 'public'),
        filename: 'bundle.js',
    },
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
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './app/app.html',
        }),
        new ExtractTextPlugin('style.css')
    ],
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
            loader: ExtractTextPlugin.extract('style', 'css!sass!')
        }]
    },
    devServer: {
        contentBase: (__dirname, 'public'),
        inline: true,
        progress: true,
        stats: 'errors-only'
    },
    // devtool: 'cheap-eval-source-map'
}

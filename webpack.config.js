'use strict';

var path = require('path');
var webpack = require('webpack');
var pkgJson = require('./package.json');

module.exports = {
    entry: './src/scroller.js',
    output: {
        path: 'dist/',
        filename: 'scroller.js',
        libraryTarget: 'umd',
        library: pkgJson.name
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    stats: {
        colors: false,
        modules: true,
        reasons: true
    },
    resolve: {
        root: [
            path.resolve('./src')
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            PKG_VERSION: JSON.stringify(pkgJson.version)
        })
    ]
};
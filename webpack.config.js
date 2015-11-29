'use strict';

var path = require('path');

module.exports = {
    entry: './src/scroller.js',
    output: {
        path: 'dist/',
        filename: 'scroller.js'
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
    }
};
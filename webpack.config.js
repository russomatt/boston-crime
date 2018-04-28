const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const loaders = {
    fileLoader: {
        test: /\.(eot|svg|ttf|woff|woff2|jpg|png)$/,
        loader: 'file-loader?name=[path][name].[hash].[ext]',
    },
    scssLoader: {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
};
const app = {
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
    },
    module: {
        rules: [
            loaders.fileLoader,
            loaders.scssLoader,
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ]
};
module.exports = [
    app
]


    // scssLoader: {
    //     test: /\.scss$/,
    //     exclude: /node_modules/,
    //     loader: 'style-loader!css-loader!sass-loader',
    // },

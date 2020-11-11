const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const result = dotenv.config().parsed;
const argv = require('yargs/yargs')(process.argv.slice(2)).argv;

module.exports = {
    mode: argv.mode,
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: { 
                            localIdentName: "[name]__[local]___[hash:base64:5]"
                        }
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: path.resolve(__dirname, 'src', 'index.html')}),
        new webpack.DefinePlugin({'process.env.MAPBOX_TOKEN': JSON.stringify(result.MAPBOX_TOKEN)})
    ]
};
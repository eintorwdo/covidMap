const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
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
    plugins: [new HtmlWebpackPlugin({template: path.resolve(__dirname, 'src', 'index.html')})]
};
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.jsx',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-runtime'
          ]
          }
        }
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg|ico)$/i,
        use: [
          'file-loader?name=assets/[name].[ext]',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true,
            },
          },
        ],
      }
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    })
  ],
  resolve: {
    extensions: ['.jsx', '.js', '.png', '.svg', '.ico', '.jpg'],
  },
  devtool: 'inline-source-map',
};

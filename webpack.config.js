const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'src/'),
  entry: {
    background: './app/background.js',
    contentScript: './app/contentScript.js',
    popup: './client/scripts/popup.js',
    settings: './client/scripts/settings.js'
  },
  output: {
    path: path.resolve(__dirname, './public/src/'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    ]
  }
};

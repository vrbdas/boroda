const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /background-check\.min\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'expose-loader',
          options: {
            exposes: ['BackgroundCheck'],
          },
        },
      },
    ],
  },
  devtool: 'source-map',
};
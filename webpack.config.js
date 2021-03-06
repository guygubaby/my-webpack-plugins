const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LogRemover = require('./webpack-plugins/dist/LogRemover');
const InjectStyle = require('./webpack-plugins/dist/InjectStyle');

const config = {
  mode: 'development',
  // mode: 'production',
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // filename: '[name].[contenthash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  node: {
    global: true,
  },
  plugins: [
    new InjectStyle([
      {
      path: path.resolve(__dirname, './src/extra-styles/loading.css'),
      sync: true,
    },
      {
      path: path.resolve(__dirname, './src/extra-styles/not-important.css'),
      sync: false,
    }
  ]),
    new LogRemover(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new CleanWebpackPlugin(),
  ],
};

module.exports = config;

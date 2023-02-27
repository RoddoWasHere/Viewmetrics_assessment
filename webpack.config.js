const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('process');

module.exports = (env) => {
  console.log("webpack env", env);
  return {
    entry: './src/index.tsx',
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    devServer: {
      port: 8000,
      historyApiFallback: true,
      static: {       
        directory: path.resolve(__dirname, './dist')
      },
      // allowedHosts: ["onroadvantage.com"],
      http2: true,
      https: {
        key: fs.readFileSync('./ssl/server.key'),
        cert: fs.readFileSync('./ssl/server.crt'),
        // ca: fs.readFileSync('/path/to/ca.pem'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: 'asset/inline',
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
      }),
      new Dotenv({
        // path: './.env',
        // // prefix: 'process.env.',
        // // ignoreStub: true,
        // safe: true,
      }),
      // new webpack.ProvidePlugin({
      //   process: 'process/browser',
      // }),
    ],
  };
};
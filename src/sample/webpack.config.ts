import { join, resolve } from 'path';
import { Configuration } from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

const config: Configuration = {
  mode: 'development',
  entry: resolve(__dirname, 'main.ts'),
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.ts?$/, loader: 'ts-loader' }
    ]
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.js']
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'index.html')
    })
  ],
  devServer: {
    contentBase: join(__dirname, 'public'),
    compress: true,
    port: 9000
  }
};

export default config;

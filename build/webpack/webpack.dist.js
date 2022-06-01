const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const webpackConfig = require('./webpack.common.js');

const config = require('../config.js');

const buildConfig = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          compress: {
            pure_funcs: ['console.debug', 'console.log'],
          },
        },
      }),
    ],
  },
  output: {
    publicPath: config.webpackBase,
  },
};

module.exports = merge(webpackConfig, buildConfig);

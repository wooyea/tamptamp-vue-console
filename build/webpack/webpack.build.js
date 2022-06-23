const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.common.js');
const config = require('../config.js');

const buildConfig = {
  mode: 'production',
  optimization: {
    minimize: false,
  },
  output: {
    publicPath: config.webpackBase,
  },
};

module.exports = merge(webpackConfig, buildConfig);

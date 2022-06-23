const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.common.js');
const config = require('../config.js');

const serverConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: config.devServerPort,
    proxy: config.devServerProxy,
  },
};

module.exports = merge(webpackConfig, serverConfig);

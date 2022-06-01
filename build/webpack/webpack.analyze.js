const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpackConfig = require('./webpack.dist');

const buildConfig = {
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
};

module.exports = merge(webpackConfig, buildConfig);

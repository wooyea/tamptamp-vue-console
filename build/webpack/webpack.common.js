const { sync } = require('glob');
const { resolve, dirname } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const HappyPack = require('happypack');
const os = require('os');
const Config = require('../config');
const ScriptDependencies = require('../ScriptDependencies');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length / 2 });
const root = './src/pages';
const { NODE_ENV } = process.env;

let ScriptDependenciesStr = '';
const copyList = [{ from: resolve('public'), to: resolve('dist') }];
const writeJson = [];
const externals = {};
ScriptDependencies.forEach((item) => {
  const package = NODE_ENV === 'development' ? item.package : item.package.replace('@', '');// 为了最后production环境中提取的包的路径不带@
  const { version } = JSON.parse(fs.readFileSync(`./node_modules/${item.package}/package.json`, 'utf8'));
  if (item.jsUrls) {
    item.jsUrls.forEach((jsItem) => {
      const url = NODE_ENV === 'development' ? jsItem.devUrl : jsItem.prodUrl;
      const jsName = url.split('/').pop();
      const scriptUrl = NODE_ENV === 'development' ? jsItem.devUrl : `/commonassets/${package}-${version}/js/${jsName}`;
      ScriptDependenciesStr += `<script src="${scriptUrl}"></script>`;
      copyList.push({
        from: resolve(`node_modules/${url}`),
        to: resolve(`dist/commonassets/${package}-${version}/js`),
      });
      writeJson.push(`/commonassets/${package}-${version}/js/${jsName}`);
      externals[jsItem.name] = jsItem.alias;
    });
  }
  if (item.cssUrls) {
    item.cssUrls.forEach((cssItem) => {
      const cssName = cssItem.split('/').pop();
      const linkUrl = NODE_ENV === 'development' ? cssItem : `/commonassets/${package}-${version}/css/${cssName}`;
      ScriptDependenciesStr += `<link rel="stylesheet" href="${linkUrl}"></link>`;
      copyList.push({
        from: resolve(`node_modules/${cssItem}`),
        to: resolve(`dist/commonassets/${package}-${version}/css`),
      });
      writeJson.push(`/commonassets/${package}-${version}/css/${cssName}`);
    });
  }
});
class WriteFile {
  writeContent;

  constructor(writeContent) {
    this.writeContent = writeContent;
  }

  apply(compiler) {
    if (NODE_ENV === 'production') {
      compiler.hooks.afterEmit.tap('WriteFile', () => {
        fs.writeFile('./dist/commonassets/commonassets.json', this.writeContent, (error) => {
          if (error) {
            console.log(error);
            return false;
          }
          return true;
        });
      });
    }
  }
}

const entries = {};
const htmlPlugins = [];//
sync(`${root}/**/app.ts`).forEach((page) => {
  const chunk = (`${dirname(page)}/index`).substr(root.length + 1);
  entries[chunk] = page;
  const htmlPlugin = new HtmlWebpackPlugin({
    inject: true,
    cache: false,
    showErrors: true,
    title: 'page',
    publicPath: NODE_ENV === 'development' ? Config.base : Config.webpackBase,
    filename: `${chunk}.html`,
    template: 'build/webpack/index.html',
    ScriptDependencies: ScriptDependenciesStr,
    chunks: [chunk],
  });
  htmlPlugins.push(htmlPlugin);
});

const webpackConfig = {
  entry: entries,
  output: {
    filename: '[name].[fullhash].js',
    path: resolve('dist'),
    chunkFilename: 'chunks/[id].[chunkhash].js',
    clean: true,
  },
  devServer: {
    static: [
      {
        directory: resolve('public'),
        publicPath: NODE_ENV === 'development' ? Config.base : Config.webpackBase,
      },
      {
        directory: resolve('node_modules'),
        publicPath: NODE_ENV === 'development' ? Config.base : Config.webpackBase,
      },
    ],
    compress: true,
    hot: true,
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['happypack/loader?id=ts'],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['happypack/loader?id=js'],
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: ['vue-loader'],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        exclude: /node_modules/,
        options: { name: 'images/[name].[ext]' },
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  resolve: {
    enforceExtension: false,
    modules: [resolve('src'), 'node_modules'],
    extensions: ['*', '.vue', '.js', '.ts', '.json', '.tsx', 'jsx'],
    alias: {
      '@': resolve('src'),
      vue: '@vue/runtime-dom',
    },
  },
  externals,
  plugins: [
    new webpack.DefinePlugin({
      __VUE_PROD_DEVTOOLS__: 'false',
    }),
    new HappyPack({
      id: 'ts',
      threadPool: happyThreadPool,
      use: [
        'babel-loader',
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            happyPackMode: true,
            appendTsSuffixTo: ['\\.vue$'],
          },
        },
      ],
    }),
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      use: [
        'babel-loader',
      ],
    }),
    // new webpack.HotModuleReplacementPlugin(),
    ...htmlPlugins,
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin({
      patterns: copyList,
    }),
    new WriteFile(JSON.stringify(writeJson)),
  ],
};

module.exports = webpackConfig;

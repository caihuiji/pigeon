const path = require('path');
const webpack = require('webpack');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    main: [ 'babel-polyfill', './app/web/page/main.js' ],
    detail: [ 'babel-polyfill', './app/web/page/detail.js' ],
  }, // 项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
  output: {
    path: path.resolve(__dirname, './app/public/'), // 项目的打包文件路径
    filename: 'js/[name]-build.js', // 打包后的文件名
  },

  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      axios$: 'axios/dist/axios.js',
    },
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: [
              'vue-style-loader',
              'css-loader',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin(),
  ],
};

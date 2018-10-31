const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './app/web/page/home.main.js', // 项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
  output: {
    path: path.resolve(__dirname, './app/public/'), // 项目的打包文件路径
    publicPath: '/js/page', // 通过devServer访问路径
    filename: '[name]-build.js', // 打包后的文件名
  },

  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: [
              'vue-style-loader',
              'css-loader',
              'sass-loader',
            ],
            sass: [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax',
            ],
          },
        },
      },
    ],
  },
};

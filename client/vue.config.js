const path = require('path')
const webpack = require('webpack')
//const HtmlWebpackPlugin = require('html-webpack-plugin')
//const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


/*var extractList = new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: false,
    })*/

// 拼接路径
function resolve (dir) {
  return path.join(__dirname, dir)
}

// 基础路径 注意发布之前要先修改这里
const baseUrl = '/'
const staticUrl = resolve('public') 

const productionSourceMap = false
const pathsToClean = [
  staticUrl,
]
const cleanOptions = {
  root:    path.resolve(__dirname,'./public'),
  verbose:  true,
  dry:      false
}

module.exports = {
  baseUrl: baseUrl, // 根据你的实际情况更改这里
  outputDir: staticUrl,
  lintOnSave: true,
  devServer: {
    publicPath: baseUrl// 和 baseUrl 保持一致
  },
  // webpack 设置
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    // markdown
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('text-loader')
      .loader('text-loader')
      .end()
    // i18n
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end()
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'd2-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
    // 重新设置 alias
    config.resolve.alias
      .set('@', resolve('src'))
    //copy ssh css.
    config.plugin('copy-ssh-css')
      .use(CopyWebpackPlugin, [[{
        from: resolve('src/pages/page-ssh/webssh.css'),
        to: staticUrl,
      }]])
    //split chuncks
    config.optimization.splitChunks({
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
          manifest: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
          },
          vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
          }
      }
    })
    // babel-polyfill 加入 entry
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
  },
  configureWebpack: config => {
    plugins: [
      // new BundleAnalyzerPlugin(),
      new CleanWebpackPlugin(pathsToClean, cleanOptions),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        sourceMap:  productionSourceMap,
        parallel: true
      }),
  
      // keep module.id stable when vendor modules does not change
      new webpack.HashedModuleIdsPlugin(),
      // enable scope hoisting
      new webpack.optimize.ModuleConcatenationPlugin(),
    ]
  }
}

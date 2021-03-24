/*
 * Created: 2021-02-22 09:19:43
 * Author : Jan
 * Last Modified: 2021-03-12 14:25:24
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

const path = require('path')
const defaultSettings = require('./src/settings.js') // 默认设置

// 获取tab的title
const name = defaultSettings.title || 'Auralabs Admin'
// 获取文件地址
function resolve (dir) {
  return path.join(__dirname, dir)
}

// 获取时间戳(保证不会版本重复)
const Timestamp = new Date().getTime();

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    hotOnly: true, // 热加载
    host: '0.0.0.0', // ip地址
    port: 8000,
    open: true,
    compress: true,
    disableHostCheck: true, // 开启热更新
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        // 本地
        target: 'https://easy-mock.bookset.io/mock/603db604336b935f320f4957/api',
        // 如果要代理 websockets
        ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    // 修改index.html的tab页命名
    name,
    output: {
      // 添加时间戳控制版本信息
      filename: `[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
      chunkFilename: `[name].${process.env.VUE_APP_Version}.${Timestamp}.js`
    }
  },
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@styles', resolve('src/styles'))
      .set('@api', resolve('src/api'))
      .set('@utils', resolve('src/utils'))
      .set('@components', resolve('src/components'))
      .set('@plugins', resolve('src/plugins'))
      .set('@views', resolve('src/views'))
      .set('@router', resolve('src/router'))
      .set('@store', resolve('src/store'))
      .set('@static', resolve('src/static'))

    // 配置svg-loader
    // 第一步：让其他svg loader不要对src/assets/imgs/svgs进行操作
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end()
    // 第二步：使用svg-sprite-loader 对 src/assets/imgs/svgs下的svg进行操作
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      //定义规则 使用时 <svg class="icon"> <use xlink:href="#icon-svg文件名"></use>  </svg>
      .options({
        symbolId: "icon-[name]"
      })
      .end()
  }
}
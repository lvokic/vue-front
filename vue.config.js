const path = require('path');

module.exports = {
  // 配置生产环境相关设置
  configureWebpack: {
    output: {
      // 构建后的模板
      path: path.resolve(__dirname, 'dist'),
      filename: 'static/js/[name].[contenthash].js',
      publicPath: '/', // 设置公共路径
    },
    // 开启 source map，适合生产环境
    devtool: 'source-map',  // 或者使用 'inline-source-map'，具体依项目需求
    optimization: {
      splitChunks: {
        chunks: 'all', // 提取公共代码
      }
    }
  },

  // 配置生产环境源映射
  productionSourceMap: true, // 保留生产环境的 SourceMap 以便调试

  // 允许在开发模式下自动打开浏览器
  devServer: {
    open: true, // 自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://localhost:8443', // 你的 API 地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''  // 重写路径
        }
      }
    }
  }
};
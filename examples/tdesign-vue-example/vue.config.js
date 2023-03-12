const { defineConfig } = require('@vue/cli-service')
const TdesignThemeWebpackPlugin = require('tdesign-theme-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new TdesignThemeWebpackPlugin()
    ]
  }
})

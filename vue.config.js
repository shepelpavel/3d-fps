const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  outputDir: './docs',
  publicPath: '/3d-fps/',
  transpileDependencies: true,
})

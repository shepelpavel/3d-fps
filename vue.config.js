const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  outputDir: path.resolve('./docs/'),
  assetsDir: './3d-fps/',
  transpileDependencies: true,
})

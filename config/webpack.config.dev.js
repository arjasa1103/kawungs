const config = require("./webpack.config")

module.exports = {
  ...config,
  mode: "development",
  devServer: {
    // disables the Hot Module Replacement feature because probably not ideal
    // in the context of generative art
    // https://webpack.js.org/concepts/hot-module-replacement/
    hot: false,
    port: 8000,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    compress: true,
    allowedHosts: ['344a4354-ae0a-4199-94e1-a7e44bab31f6.cfargotunnel.com']
  },
}
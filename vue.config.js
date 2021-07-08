const registerRouter = require('./backend/router')

module.exports = {
  publicPath: "./",
  css: {
    loaderOptions: {
      sass: {
        // 全局引入sass可以识别的 sass 变量和 mixin
        prependData: `
        @import "@/assets/scss/variable.scss";
        @import "@/assets/scss/mixin.scss";
      `
      }
    }
  },
  devServer: {
    before(app) {
      registerRouter(app)
    }
  }
}

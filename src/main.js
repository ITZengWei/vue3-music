import { createApp } from 'vue'
import layPlugin from 'vue3-lazy'
import App from './App.vue'
import router from './router'
import store from './store'
/** 引用全局样式 */
import './assets/scss/index.scss'
import loadingDirective from "./components/base/loading/directive";


createApp(App)
  .use(store)
  .use(router)
  .use(layPlugin, {
    loading: require('@/assets/images/default.png')
  })
  .directive('loading', loadingDirective)
  .mount('#app')

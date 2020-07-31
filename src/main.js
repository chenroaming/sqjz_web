import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import VCharts from 'v-charts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'video.js/dist/video-js.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(VCharts)
// console.log(process.env)
// require('./mock/index.js') // 虚拟请求，开发时可用，打包生产包前需注释再打包

Vue.mixin({// 全局混入表格表头样式
  methods: {
    rowClass() {
      return 'border-top: 2px solid rgb(64, 158, 255);'
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

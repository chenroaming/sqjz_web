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
import { Vpermission } from '@/utils/permission' // 引入自定义按钮权限控制指令
import 'default-passive-events' // 解决浏览器一直报警的问题
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(VCharts)
process.env.NODE_ENV === 'development' && require('./mock/index.js') // 虚拟接口请求，开发时可用
Vue.mixin({// 全局混入表格表头样式
  methods: {
    rowClass() {
      return 'border-top: 2px solid rgb(64, 158, 255);'
    }
  }
})
console.log('written by roaming')
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

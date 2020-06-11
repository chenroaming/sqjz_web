import Vue from 'vue'
import VCharts from 'v-charts'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'video.js/dist/video-js.css'

import '@/styles/index.scss' // global css
import PuzzleVerification from 'vue-puzzle-verification'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/styles/table.scss'//引入公共样式文件
Vue.use(ElementUI)
Vue.use(VCharts)
Vue.use(PuzzleVerification)
Vue.config.productionTip = false

Vue.mixin({//全局混入表格表头样式
  methods: {
    rowClass(){
      return 'border-top: 2px solid rgb(64, 158, 255);'
    },
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

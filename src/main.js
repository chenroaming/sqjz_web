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
Vue.use(ElementUI)
Vue.use(VCharts)
Vue.use(PuzzleVerification)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

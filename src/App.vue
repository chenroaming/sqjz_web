<template>
  <div id="app">
    <transition name="fade-transform" mode="out-in">
      <router-view v-if="isRouterAlive" />
    </transition>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    // 重载
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  #app {
    overflow-x: auto;
    overflow-y: auto;
  }
</style>

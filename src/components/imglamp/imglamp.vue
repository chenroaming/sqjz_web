<template>
  <transition name='fade'>
    <div class='wrap-mask' v-if="isShow" @click="$emit('closeModal')">
      <el-button
      type="danger"
      icon="el-icon-close"
      circle
      class='closeBtn'
      @click="$emit('closeModal')"
      ></el-button>
      <div class='wrap-lamp' @click.stop>
        <img :src="path" alt="" class="bigImg">
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isShow: false,
    path: '',
  },
}
</script>

<style lang='scss' scoped>
  .wrap {
    &-mask {
      width: 100%;
      height: 100%;
      z-index: 10000;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .8);
      position: fixed;
      
    }
    &-lamp {
      width: 1280px;
      height: 720px;
      background: rgba(0, 0, 0, .2);
      margin: 50px auto;
      overflow: hidden;
      display: flex;
      justify-content: center
    }
  }

  .closeBtn {
    position: absolute;
    bottom: 2%;
    left: 48%;
  }
  .bigImg{
    height: 100%;
  }
</style>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s ease-in-out;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>

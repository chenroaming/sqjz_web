<template>
  <div>
    <el-carousel :height="height">
      <el-carousel-item
      v-for="item in carouselContent"
      :key="item.id"
      class="carousel-item"
      :class="'carousel-color'+Math.floor(Math.random()*4)"
      >
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {

  props:{
    // 轮播图默认高度
    height:{
      default:"300px",
      required:false,
      type: String,
    },
    // 默认轮播数组
    carouselContent:{
      default:function () {
        return [];
      },
      required: false,
      type: Array,
    }
  },

  mounted () {
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .carousel {
    &-item {
      background:#99a9bf;
      border-radius: 3px;
    }
    &-color1 {
      background: #409EFF;
    }
    &-color2 {
      background: #67C23A;
    }
    &-color3 {
      background: #F56C6C;
    }
  }
</style>

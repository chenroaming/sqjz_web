<template>
  <div class='sortpage'>
    <el-pagination
    v-if="sortShow"
    class='sortPageArea'
    background
    layout="prev, pager, next, total"
    style="text-align:right;margin-top:10px"
    :current-page="currentPage"
    :total="totalPages"
    :page-size="pageSize"
    @current-change="(pages)=>{$emit('sizeChange',pages)}"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    totalPages: {
      require: true,
      default: 0,
      type: Number
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    sortShow: {
      type: Boolean,
      default: true,
    }
  },
}
</script>

<style lang='scss' scoped>
  .sortpage {
    // position: fixed;
    height: 4vh;
    padding-top: 1vh;
    bottom: 0;
    right: 0;
  }
</style>

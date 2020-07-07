<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="查看信息"
    center
    width="30%"
    append-to-body>
    <div style="text-align: center;">
      <el-image
        v-for="(item,index) in interviewPicPaths"
        :key="index"
        :src="item"
        style="width: 300px; height: 300px"/>
    </div>
    <span slot="footer">
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ShowDetail',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    interviewPicPaths: Array
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.dialogVisible = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

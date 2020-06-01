<template>
  <el-dialog
    title="查看信息"
    :visible.sync="dialogVisible"
    center
    width="30%"
    append-to-body>
    <div style="text-align: center;">
      <el-image
        style="width: 300px; height: 300px"
        v-for="(item,index) in interviewPicPaths"
        :key="index"
        :src="item">
      </el-image>
    </div>
    <span slot="footer">
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "showDetail",
    props:{
      interviewPicPaths:Array
    },
    data() {
      return {
        dialogVisible:false,
      }
    },
    mounted() {

    },
    methods: {
      show(){
        this.dialogVisible = true;
      },
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
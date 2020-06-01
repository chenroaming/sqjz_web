<script>
export default {
  name: "shortcut",
  data() {
    return {
      bodyStyle:{
        // padding:'50px 145px'
        textAlign: 'center'
      }
    };
  },
  computed: {
    
  },
  mounted() {
    
  },

  methods: {
    
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box-card{
    width: 100%;
    height: 150px;
    float: left;
    margin-right: 2%;
  }
</style>

<template>
  <el-card class="box-card" :body-style="bodyStyle">
    <div slot="header" class="clearfix">
      <span>快捷方式</span>
    </div>
    <router-link style="margin-right:15px;" :to="{ path:'/Communityuser/index'}">
      <el-button type="primary">矫正电子档案</el-button>
    </router-link>
    <el-button type="primary" disabled>每月评估报告</el-button>
    <el-button type="primary"><a href="https://www.ecorrect.cn/#/Visualization" target="_blank">可视化平台</a></el-button>
  </el-card>
</template>
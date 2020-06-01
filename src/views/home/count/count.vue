<script>
export default {
  name: "count",
  props:{
    count:{
      trpe:Object,
      default:() => {
        return {
          totalNumber:0,
          correctedNumber:0,
          out:0
        }
      }
    }
  },
  data() {
    return {
      bodyStyle:{
        // padding:'62px 50px'
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
  }
</style>

<template>
  <el-card class="box-card" :body-style="bodyStyle">
    <div slot="header" class="clearfix">
      <span>当日统计</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <span>在矫人数：</span>
        <span>{{count.totalNumber}}人</span>
      </el-col>
      <el-col :span="8">
        <span>当日入矫：</span>
        <span>{{count.correctedNumber}}人</span>
      </el-col>
      <el-col :span="8">
        <span>当日解矫：</span>
        <!-- <span>{{count.out}}人</span> -->
        <span>0人</span>
      </el-col>
    </el-row>
  </el-card>
</template>
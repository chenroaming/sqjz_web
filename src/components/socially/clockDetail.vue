<template>
  <div>
    <el-dialog title="详情" width="80%" append-to-body :visible.sync="dialogTableVisible">
      <el-table
        :data="detailList"
        element-loading-text="数据拼命加载中...."
        height="250px"
        style="width: 100%"
      >
        <el-table-column prop="activityLocation" label="活动地点" align="center"></el-table-column>
        <el-table-column prop="community_name" label="社区名称" align="center"></el-table-column>
        <el-table-column prop="identityCard" label="身份证号码" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话号码"" align="center"></el-table-column>
        <el-table-column prop="userName" label="矫正人姓名" align="center"></el-table-column>
        <el-table-column prop="startDate" label="开始时间" align="center"></el-table-column>
        <el-table-column prop="endDate" label="结束时间" align="center"></el-table-column>
        <el-table-column prop="picPath" label="操作"" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showPic(scope.row.picPath)">查看照片集</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="图片集" width="50%" center :visible.sync="dialogTableVisible2" append-to-body>
      <div class="bigBox">
        <div class="picBox" v-for="(item,index) in picArr" :key="index">
          <el-image
            style="width: 300px;height: 300px;"
            :src="item">
          </el-image>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "clockDetail",
    props:{
      detailList:Array
    },
    data() {
      return {
        dialogTableVisible:false,
        dialogTableVisible2:false,
        direction: 'rtl',
        picArr:[],
      }
    },
    computed: {

    },
    mounted() {

    },
    methods: {
      show(){
        this.dialogTableVisible = true;
      },
      showPic(picArr){
        this.picArr = picArr.split(',');
        this.dialogTableVisible2 = true;
      },
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .bigBox{
    width: 100%;
    height: 350px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    text-align: center;
  }
  .picBox{
    display: inline-block;
    text-align: center;
    width: 300px; 
    height: 300px;
    margin-right: 10px;
  }
</style>

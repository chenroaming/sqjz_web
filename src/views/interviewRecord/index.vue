<template>
  <div>
    <div class="select-box">
      <el-button-group>
        <el-button type="primary" v-for="(item,index) in buttonGroup" :key="index" plain :class="nowIndex === item.index ? 'isSelect' : ''" @click="changeSelect(item.index)">{{item.label}}</el-button>
      </el-button-group>
    </div>
    <div class="input-box">
      <el-input style="width: 200px;" v-model="nowName" placeholder="请输入名称"></el-input>
      <el-button type="primary" @click="search">搜索</el-button>
    </div>
    <el-table
      v-loading="isLoading"
      :data="tableData"
      class="attendanceTable"
      element-loading-text="数据拼命加载中...."
      height="250px"
      style="width: 100%"
    >
      <el-table-column prop="name" label="矫正人姓名"" align="center"></el-table-column>
      <el-table-column prop="picPath" label="照片" align="center">
        <template slot-scope="scope">
          <el-image
          style="width: 100px; height: 100px"
          :src="scope.row.picPath">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="interviewType" label="走访类型" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.interviewType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="adminName" label="走访人" align="center"></el-table-column>
      <el-table-column prop="location" label="位置信息" align="center"></el-table-column>
      <el-table-column prop="interviewPicPaths" label="走访照片集" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;text-align: right;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="totalPage">
      </el-pagination>
    </div>
    <showDetail ref="showDetail" :interviewPicPaths="interviewPicPaths"></showDetail>
  </div>
</template>

<script>
import { find } from "@/api/interviewRecord";
import showDetail from "@/components/interviewRecord/showDetail.vue"
export default {
  name: "interviewRecord",
  components:{
    showDetail,
  },
  data() {
    return {
      buttonGroup:[{index:3,label:'全部'},{index:1,label:'现场'},{index:2,label:'远程'}],
      isLoading:false,
      nowIndex:3,
      tableData:[],
      currentPage:1,
      totalPage:1,
      nowName:'',
      interviewPicPaths:[],
    }
  },
  computed: {

  },
  mounted() {
    this.getList();
  },
  methods: {
    changeSelect(index){
      this.nowIndex = index;
      const searchIn = index === 3 ? '' : index;
      this.currentPage = 1;
      if(index === 3){
        this.nowName = '';
      }
      this.getList(searchIn);
    },
    handleCurrentChange(e){
      const searchIn = this.nowIndex === 3 ? '' : this.nowIndex;
      this.getList(searchIn,this.nowName,e);
    },
    search(){
      this.getList('',this.nowName);
    },
    showDetail(item){
      this.interviewPicPaths = item.interviewPicPaths;
      this.$refs.showDetail.show();
    },
    getList(interviewType = '',name = '',pageNumber = 1){
      find('','',name,interviewType,pageNumber).then(res => {
        if(res.data.state == 100){
          const newArr = res.data.list.map(item => {
            return {
              ...item,
              createDate:this.exChange(item.createDate.time),
              interviewType:this.buttonGroup[item.interviewType].label
            }
          })
          this.tableData = newArr;
          this.totalPage = res.data.total;
          return;
        }
        this.tableData = [];
        this.totalPage = 0;
      })
    },
    exChange(time){
      const myDate = new Date(time);
      return `${myDate.getFullYear()}-${(myDate.getMonth()+1)}-${myDate.getDate()}   ${myDate.getHours()}:${myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()}`;
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .select-box {
    width: 50%;
    margin: 20px 0px;
    margin-left: 20px;
    float: left;
  }
  .input-box {
    width: 30%;
    margin: 20px 0px;
    float: right;
  }
  .isSelect {
    background: #409EFF;
    border-color: #409EFF;
    color: #FFF;
  }
  .attendanceTable {
    max-height: calc(100vh - 180px);
    min-height: calc(100vh - 180px);
    overflow-y: auto;
  }
</style>

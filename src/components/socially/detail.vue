<template>
  <div>
    <el-dialog title="打卡活动列表" append-to-body width="60%" center :visible.sync="dialogTableVisible2">
      <el-table
        v-loading="isLoading"
        :data="tableData"
        class="attendanceTable"
        element-loading-text="数据拼命加载中...."
        height="250px"
        style="width: 100%"
      >
        <el-table-column prop="userName" label="名称" align="center" width="150px"></el-table-column>
        <!-- <el-table-column prop="location" label="位置" align="center" width="150px"></el-table-column> -->
        <el-table-column prop="picPath" label="照片" align="center" width="150px">
          <template slot-scope="scope">
            <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.picPath">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="theme" label="活动主题" align="center" width="150px"></el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.id ? 'info' : 'warning'">{{scope.row.id ? '已打卡' : '未打卡'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.id" type="primary" size="mini" @click="showDetail(scope.row.id)">详情</el-button>
            <!-- <el-button type="primary" size="mini" @click="dialogTableVisible = true;nowId = scope.row.id">审核</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;text-align: right;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="5"
          layout="total, prev, pager, next"
          :total="totalPage">
        </el-pagination>
      </div>
    </el-dialog>
    <clockDetail ref="clockDetail" :detail="detail"></clockDetail>
    <!-- <el-dialog title="审核" append-to-body width="30%" center :visible.sync="dialogTableVisible">
      <el-radio-group v-model="radio">
        <el-radio :label="0">待审核</el-radio>
        <el-radio :label="1">审核通过</el-radio>
        <el-radio :label="2">审核不通过</el-radio>
      </el-radio-group>
      <div slot="footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  import { findEasyClockInList,findClockInListDetail,findClockInListDetail2 } from '@/api/socially.js'
  import clockDetail from '@/components/socially/clockDetail.vue'
  export default {
    name: "sociallyDetail",
    props:{
      userId:{
        type:String,
        default:''
      },
    },
    components:{
      clockDetail
    },
    data() {
      return {
        theme:'',
        isLoading:false,
        currentPage:1,
        totalPage:0,
        tableData:[],
        stateArr:[{index:0,label:'待审核'},{index:1,label:'审核通过'},{index:2,label:'审核不通过'}],
        detail:{},
        radio:'',
        nowId:'',
        dialogTableVisible:false,
        dialogTableVisible2:false,
      }
    },
    computed: {

    },
    watch:{
      userId(newData,old){
        this.theme = newData;
        this.getList();
      },
    },
    mounted() {
      // this.getList();
    },
    methods: {
      getList(PageNum = 1){
        findEasyClockInList(PageNum,this.theme).then(res => {
          if(res.data.state == 100){
            this.tableData = res.data.list;
            this.totalPage = res.data.total;
            return;
          }
          this.tableData = [];
          this.totalPage = 0;
        })
      },
      show(){
        this.dialogTableVisible2 = true;
      },
      handleCurrentChange(e){
        this.getList(e);
      },
      showDetail(id){
        findClockInListDetail(id).then(res => {
          if(res.data.state == 100){
            const newDetailList = res.data.list.map(item => {
              return {
                ...item,
                startDate:this.exChange(item.startDate.time),
                endDate:this.exChange(item.endDate.time)
              }
            })
            this.detail = newDetailList[0];
            this.$refs.clockDetail.show();
          }
        })
      },
      exChange(time){
        const myDate = new Date(time);
        return `${myDate.getFullYear()}-${(myDate.getMonth()+1)}-${myDate.getDate()}   ${myDate.getHours()}:${myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()}`;
      },
      submit(){
        findClockInListDetail2(this.nowId,this.radio).then(res => {
          if(res.data.state == 100){
            this.dialogTableVisible = false;
            this.radio = '';
          }
        })
      },
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .attendanceTable {
    max-height: calc(100vh - 180px);
    min-height: calc(100vh - 180px);
    overflow-y: auto;
  }
</style>

<template>
  <div>
    <div class='searchArea'>
      <div class='backTo' style="cursor:pointer">
        <el-button circle size="mini" icon="el-icon-arrow-left" @click="handleBack" style="margin-right:20px"></el-button>
        <span style="margin-right:8px;"  @click="selectState('')">总人数：<span>{{signed+leave+absent}}</span></span>
        <span style="margin-right:8px;color:green" @click="selectState(0)">签到人数：<span style="color:green">{{signed}}</span></span>
        <span style="margin-right:8px;color:#E6A23C" @click="selectState(1)">请假人数：<span style="color:#E6A23C">{{leave}}</span></span>
        <span style="margin-right:8px;color:#F56C6C" @click="selectState(2)">缺勤人数：<span style="color:#F56C6C">{{absent}}</span></span>
        <span style="margin-right:8px;color:gray" v-if="detailState == 0">（考勤状态：<span style="color:gray">未开始</span>）</span>
        <span style="margin-right:8px;color:green" v-if="detailState == 1">（考勤状态：<span style="color:green">进行中</span>）</span>
        <span style="margin-right:8px;color:#F56C6C" v-if="detailState == 2">（考勤状态：<span style="color:#F56C6C">已结束</span>）</span>
      </div>
      <div class='detailInfo'>
        <el-input v-model="searchName" placeholder="请输入用户名" style="width:150px" size="small"></el-input>
        <span style="color:#303133;font-size:14px" >人脸库：</span>
        <el-select v-model="searchFaceset" placeholder="请选择" size="small">
          <el-option :value="''" label="全部"></el-option>
          <el-option
            v-for="item in facesetList"
            :key="item.facesetId"
            :label="item.facesetName"
            :value="item.facesetId">
          </el-option>
        </el-select>
        <span style="color:#303133;font-size:14px" >考勤日期：</span>
        <el-select v-model="hasSelectDate" placeholder="请选择考勤日期" size="small">
          <el-option
            v-for="item in dateList"
            :key="item.date"
            :label="item.date"
            :value="item.date">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button type="danger" size="small" circle icon="el-icon-refresh" @click="handleRefresh"></el-button>
      </div>
    </div>

    <el-table
      class='taskTable'
      :data="tableData"
      height="80px"
      v-loading="isLoading"
      style="width: 100%">
      <el-table-column
        label="标准照片"
        align="center">
        <template slot-scope="scope">
          <img :src="scope.row.uPhoto" alt="" style="width:80px;height:100px;cursor:pointer">
        </template>
      </el-table-column>
      <el-table-column
        label="抓拍缩略图"
        align="center">
        <template slot-scope="scope">
          <img :src="scope.row.rPhoto" alt="" style="width:80px;height:100px;cursor:pointer" @click="handleLookLphoto(scope.row.lPhoto)">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="facesetName"
        label="所属人脸库"
        align="center">
      </el-table-column>
      <el-table-column
        prop="atstate"
        label="考勤情况"
        align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.atstate === 0 && scope.row.mendState === null">已签到</el-tag>
          <el-tag type="success" v-if="scope.row.atstate === 0 && scope.row.mendState === true">补签到</el-tag>
          <el-tag type="warning" v-if="scope.row.atstate === 1">请假</el-tag>
          <el-tag type="danger" v-if="scope.row.atstate === 2">未签到</el-tag>
          <!-- <el-tag type="danger" v-if="scope.row.atstate != null && scope.row.mendState == null">暂无</el-tag>           -->
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="考勤状态"
        align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.adstate === 0">未开始</el-tag>
          <el-tag type="warning" v-if="scope.row.adstate === 1">进行中</el-tag>
          <el-tag type="danger" v-if="scope.row.adstate === 2">已结束</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        label="考勤时间"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate == null?'':scope.row.createDate.time | formatTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
           <el-button type="danger" size="mini" v-if="scope.row.isOperate === true" @click="findDelete(scope.row.detailId)">已删记录</el-button>
           <el-button type="success" size="mini" @click="handleCheckon(scope.row.detailId)" v-if="scope.row.atstate !== 0">补签到</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看访客详情 -->
    <el-dialog
      title="删除记录信息"
      :visible="lookBox"
      :close-on-click-modal=true
      :show-close=false
      width="20%"
      :center=true
    >
      <el-card :body-style="{ padding: '0px', textAlign:'center' }" v-for="(item,index) in deleteRecordList"  :key="item.signDate.time">
        <img :src="item.lPhoto" class="image">
        <div style="padding: 14px;">
          <span>{{ item.signDate.time | formatTime}}</span>
          <div class="bottom clearfix">
            <time class="time"></time>
            <el-button type="text" class="button">{{ item.name}}</el-button>
          </div>
        </div>
      </el-card>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="lookBox = false">关闭</el-button>
      </span>
    </el-dialog>
    <Page
    :currentPage="currentPage"
    :sortShow="sortShow"
    :totalPages="totalPages"
    @sizeChange="handleSizeChange"/>
    <Lamp
    :isShow="lampShow"
    :path="imgPath"
    @closeModal="lampShow=false"/>
  </div>
</template>

<script>
import { getAttendanceDetail, getCheckon, getTaskFaceset,getTaskDate,findDeleteRecord} from '@/api/attendance';
import { computedFormatTime } from '@/utils/tools';
import Lamp from '@/components/imglamp/imglamp';
import Page from '@/components/sortpage/sortpage';
import  sortmix from "@/utils/sortmix";
export default {
  mixins: [sortmix],
  components: {
    Lamp,
    Page
  },
  data () {
    return {
      detailState:'',
      isLoading:true,
      signed: 0, // 签到人数
      leave: 0, // 请假人数
      absent: 0, // 缺勤人数
      searchName: '', // 搜索用户名
      searchFaceset: '',
      currentPage: 1,
      totalPages: 0,
      tableData: [],
      detailObj: {},
      facesetList: [],
      dateList: [],//考勤日期选项
      hasSelectDate:'',//所选日期
      attendanceState: '',
      lookBox:false,//查看已删记录列表框
      deleteRecordList:[],//已删记录列表
      attendanceStateList: [
      {
        id: 0,
        label: '全部',
        value: '',
      },
      {
        id: 1,
        label: '已签到',
        value: '0',
      },
      {
        id: 2,
        label: '请假',
        value: '1',
      },
      {
        id: 3,
        label: '未签到',
        value: '2',
      },
      ],
      lampShow: false,
      sortShow: true,
      imgPath:'',
    }
  },

  mounted () {
    if (sessionStorage.getItem('detailInfo')) {
      this.detailObj = JSON.parse(sessionStorage.getItem('detailInfo'));
      this.getAttendanceDetailList(this.detailObj);
    } else {
      sessionStorage.setItem('detailInfo',JSON.stringify(this.$route.params));
      this.detailObj = Object.assign({},this.$route.params);
      this.getAttendanceDetailList(this.$route.params);
    }
     this.getTaskFaceset();
     this.getDateList();
  },

  filters:{
    formatTime (val) {
      return computedFormatTime(val);
    }
  },

  methods: {
    // 获取列表
    getAttendanceDetailList (payload) {
      getAttendanceDetail(payload)
      .then(res=>{
        this.tableData = res.data.List;
        this.detailState = res.data.adstate;
        this.signed = res.data.signed;
        this.leave = res.data.leave;
        this.absent = res.data.absent;
        this.totalPages = res.data.total;
        this.currentPage = res.data.pageNumber;
        this.isLoading = false;
        this.$message({
          type: "success",
          message: '获取成功'
        })
      }).catch(()=>{
        this.tableData = [];
        this.isLoading = false;
      });
    },

    // 获取人脸库列表
    getTaskFaceset () {
      getTaskFaceset(this.detailObj.taskId)
      .then(res=>{
        this.facesetList = res.data.List;
      }).catch(()=>{});
    },
    // 获取任务执行时间列表
    getDateList () {
      getTaskDate(this.detailObj.taskId)
      .then(res=>{
        this.dateList = res.data.List;
      }).catch(()=>{});
    },
    // 补签到
    handleCheckon (detailId) {
      getCheckon(detailId)
      .then(res=>{
        this.$message({type: 'success', message: '补签到成功'});
        this.handleSearch();
      })
      .catch(()=>{});
    },

    // 返回
    handleBack () {
      sessionStorage.removeItem('detailInfo');
      this.$router.push({name:'normal-manger'});
    },

    // 查看大图
    handleLookLphoto (path) {
      this.lampShow = true;
      this.imgPath = path;
    },

    // 分页
    handleSizeChange (num) {
      let payload = Object.assign({}, this.detailObj);
      payload['pageNumber'] = num;
      payload['name'] = this.searchName;
      payload['facesetId'] = this.searchFaceset;
      payload['date'] = this.hasSelectDate;
      payload['state'] = this.attendanceState;
      this.getAttendanceDetailList(payload);
    },

    // 刷新
    handleRefresh () {
      this.searchName = '';
      this.searchFaceset = '';
      this.attendanceState = '';
      this.isLoading = true;
      this.getAttendanceDetailList(this.detailObj);
    },

    // 搜索
    handleSearch () {
      this.isLoading = true;
      let payload = Object.assign({}, this.detailObj);
      payload['facesetId'] = this.searchFaceset;
      payload['name'] = this.searchName;
      payload['date'] = this.hasSelectDate;
      payload['state'] = this.attendanceState;
      // payload['state'] = this.attendanceState;
      this.getAttendanceDetailList(payload);
    },

    //点击状态
    selectState(val){
      this.attendanceState = val;
      this.handleSearch()
    },
    // 查看已删记录
    findDelete(id){
      findDeleteRecord(id,10,1)
      .then(res=>{
        // console.log(res)
        this.lookBox = true;
        this.deleteRecordList = res.data.List;
      })
      .catch(()=>{});
    }
  }
}
</script>

<style lang='scss' scoped>
  .backTo {
    white-space: nowrap;
  }

  .searchArea {
    width: 98%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: nowrap;
  }
  .detailInfo {
    width: 95%;
    margin: 10px auto;
    text-align: right;
  }

  .taskTable {
    min-height: 700px;
    max-height: 700px;
    overflow-y: auto;
  }
  .image {
    width: 100%;
    height:340px;
    display: block;
  }
</style>

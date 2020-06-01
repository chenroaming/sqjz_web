<template>
  <div class='main'>
    <div class="dateArea">
        <span class="demonstration">选择开始日期 : </span>
        <el-date-picker
          v-model="selectBegin"
          type="date"
          value-format="yyyy-MM-dd" 
          :picker-options="pickerOptions"
          placeholder="请选择开始日期">
        </el-date-picker>
        <span class="demonstration">选择结束日期 : </span>
        <el-date-picker
          v-model="selectEnd"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          placeholder="请选择结束日期">
        </el-date-picker>
        <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="dashboard-container">   
      <!-- 快捷方式 -->
      <div class='fastIns'>
        <div class='fastIns-left'>
          <div class='fastIns-left-header'>
            <span>性别统计</span>
          </div>
          <ve-pie :data="chartDataSex" :settings="chartSettingsSex" legend-position="right" height="260px"></ve-pie>
        </div>
        <div class='fastIns-right'>
          <div class='fastIns-left-header'>
            <span>年龄统计</span>
          </div>
          <ve-pie :data="chartDataPie" :settings="chartSettingsPie" legend-position="right" height="260px"></ve-pie>
        </div>
      </div>
      <div class='fastIns' style="margin-top:10px;">
        <div class='fastIns-left'>
          <div class='fastIns-left-header'>
            <span>摄像头统计</span>
          </div>
          <ve-pie :data="chartDataCam" :settings="chartSettingsCam" legend-position="right" height="260px"></ve-pie>
        </div>
        <div class='fastIns-right'>
          <div class='fastIns-left-header'>
            <span>用户类别统计</span>
          </div>
          <ve-pie :data="chartDataUser" :settings="chartSettingsUser" legend-position="right" height="260px"></ve-pie>
        </div>
      </div>
      <div class='fastIns' style="margin-top:100px;">
        <div style="padding:10px 4%;background-color:white;border-radius: 10px;width:98%">
          <span>楼栋统计</span>
          <ve-histogram :data="chartData" :settings="chartSettings"></ve-histogram>
        </div>
      </div>
      <el-button
        v-show="fullscreenLoading"
        type="primary"
        @click="openFullScreen"
        v-loading.fullscreen.lock="fullscreenLoading">
        加载中....   
      </el-button>
    </div>
    
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { chartMessageCount } from "@/api/snapshot";

export default {
  name: 'Dashboard',
  data () {

    this.chartSettingsPie = {
      offsetY: '120px',
    }
    this.chartSettingsSex = {
      offsetY: '120px',
    }
    this.chartSettingsUser = {
      offsetY: '120px',
    }
    this.chartSettingsCam = {
      offsetY: '120px',
    }
    this.chartSettings = {
      stack: { '楼栋名称': ['进门', '出门'] },
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;//如果没有后面的-8.64e6就是不可以选择今天的
        }
      }, 
      selectBegin:null,//开始时间
      selectEnd:null,//结束时间，
      fullscreenLoading: false,
      //年龄统计图表
      chartDataPie: {
        columns: ['年龄类别', 'guest'],
        rows: [
          { '年龄类别': '1-18岁', 'guest': 0 },
          { '年龄类别': '19-30岁', 'guest': 0 },
          { '年龄类别': '31-50岁', 'guest': 0 },
          { '年龄类别': '其他', 'guest': 0 },
          // { '年龄类别': '总计', 'guest': 14586 },
        ]
      },
      //性别统计图表
      chartDataSex: {
        columns: ['性别类别', 'guest'],
        rows: [
          { '性别类别': '男', 'guest': 0 },
          { '性别类别': '女', 'guest': 0 },
          { '性别类别': '其它', 'guest': 0 },
          // { '性别类别': '总计', 'guest': 14586 },
        ]
      },
      //用户类型统计图表
      chartDataUser: {
        columns: ['用户类别', 'guest'],
        rows: [
          { '用户类别': '用户', 'guest': 0 },
          { '用户类别': '黑名单', 'guest': 0 },
          { '用户类别': '陌生人', 'guest': 0 },
          // { '用户类别': '总计', 'guest': 14586 },
        ]
      },
      //摄像头统计图表
      chartDataCam: {
        columns: ['摄像头类别', 'guest'],
        rows: [
          { '摄像头类别': '用户', 'guest': 0 },
          { '摄像头类别': '黑名单', 'guest': 0 },
          { '摄像头类别': '陌生人', 'guest': 0 },
          // { '摄像头类别': '总计', 'guest': 14586 },
        ]
      },
      //楼栋统计
      chartData: {
        columns: ['楼栋名称', '进门', '出门'],
        rows: [
          { '楼栋名称': '1/1', '进门': 0, '出门': 0},
          { '楼栋名称': '1/2', '进门': 0, '出门': 0},
          { '楼栋名称': '1/3', '进门': 0, '出门': 0},
          { '楼栋名称': '1/4', '进门': 0, '出门': 0},
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
  },
  mounted () {
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    this.selectBegin = currentdate;
    this.selectEnd = currentdate;
    const loading = this.$loading({
      lock: true,
      text: '统计数据加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    chartMessageCount(this.selectBegin,this.selectEnd)
    .then(res=>{
      //转化年龄图表
      this.chartDataPie.rows[0].guest = res.data.ageCount.twenty;
      this.chartDataPie.rows[1].guest = res.data.ageCount.thirty;
      this.chartDataPie.rows[2].guest = res.data.ageCount.fifty;
      this.chartDataPie.rows[3].guest = res.data.ageCount.other;
      // this.chartDataPie.rows[4].guest = res.data.ageCount.total;
      //转化性别图表
      this.chartDataSex.rows[0].guest = res.data.genderCount.male;
      this.chartDataSex.rows[1].guest = res.data.genderCount.female;
      this.chartDataSex.rows[2].guest = res.data.genderCount.other;
      // this.chartDataSex.rows[3].guest = res.data.genderCount.total;
      //转化用户类别图表
      this.chartDataUser.rows[0].guest = res.data.userTypeCount.user;
      this.chartDataUser.rows[1].guest = res.data.userTypeCount.black;
      this.chartDataUser.rows[2].guest = res.data.userTypeCount.stranger;
      // this.chartDataUser.rows[3].guest = res.data.userTypeCount.total;
      //转化摄像头类别图表
      let camAry = [];
      for(var i in res.data.webcamCount) {
          if( i == 'total'){
            i = '总计';
          }
          let canObj = { '摄像头类别': i, 'guest': res.data.webcamCount[i] };
          camAry.push(canObj)
      }
      this.chartDataCam.rows = camAry;
      //转化楼栋统计
      let y = res.data.buildingCount.map(item=>{
        return {'楼栋名称': item.buildingName, '进门': item.inNum,'出门': item.outNum};
      })
      this.chartData.rows = y;
      loading.close();
    }).catch(()=>{});
  },

  methods: {
    openFullScreen(){
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 1000);
    },
    search(){
      if(this.selectBegin != null && this.selectEnd == null){
        this.$message({type: 'error', message: '请选择您要查询的截止日期！'});
        return;
      }
      if(this.selectBegin == null && this.selectEnd != null){
        this.$message({type: 'error', message: '请选择您要查询的起始日期！'});
        return;
      }
      this.openFullScreen();
      chartMessageCount(this.selectBegin,this.selectEnd)
      .then(res=>{
        //转化年龄图表
        this.chartDataPie.rows[0].guest = res.data.ageCount.twenty;
        this.chartDataPie.rows[1].guest = res.data.ageCount.thirty;
        this.chartDataPie.rows[2].guest = res.data.ageCount.fifty;
        this.chartDataPie.rows[3].guest = res.data.ageCount.other;
        // this.chartDataPie.rows[4].guest = res.data.ageCount.total;
        //转化性别图表
        this.chartDataSex.rows[0].guest = res.data.genderCount.male;
        this.chartDataSex.rows[1].guest = res.data.genderCount.female;
        this.chartDataSex.rows[2].guest = res.data.genderCount.other;
        // this.chartDataSex.rows[3].guest = res.data.genderCount.total;
        //转化用户类别图表
        this.chartDataUser.rows[0].guest = res.data.userTypeCount.user;
        this.chartDataUser.rows[1].guest = res.data.userTypeCount.black;
        this.chartDataUser.rows[2].guest = res.data.userTypeCount.stranger;
        // this.chartDataUser.rows[3].guest = res.data.userTypeCount.total;
        //转化摄像头类别图表
        let camAry = [];
        for(var i in res.data.webcamCount) {
            if( i == 'total'){
              i = '总计';
            }
            let canObj = { '摄像头类别': i, 'guest': res.data.webcamCount[i] };
            camAry.push(canObj)
        }
        this.chartDataCam.rows = camAry;
        //转化楼栋统计
        let y = res.data.buildingCount.map(item=>{
          return {'楼栋名称': item.buildingName, '进门': item.inNum,'出门': item.outNum};
        })
        this.chartData.rows = y;
      }).catch(()=>{});
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dateArea{
    height: 70px;
    line-height: 70px;
    text-align: center;
    padding-right: 30px;
  }
  .demonstration{
    color: gray;
    margin-left: 10px;
  }
  .flowGreen {
    background:  #ccf2f3;
  }

  .flowPurple {
    background: #ecd5f6;
  }

  .flowBlue {
    background: #dee5ff;
  }

  .flowDeepBlue {
    background: rgba(0, 116, 232,.2);
  }

  .main {
    width: 100%;
    height: calc(100vh - 50px);
    background: #F3F6FF;
  }

  .dashboard-container {
    width: 98%;
    height: 500px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 20px;
  }

  .topbar {
    width: 100%;
    display: flex;
    flex-direction: row;
    cursor: pointer;
    &-item {
      width: 240px;
      height: 180px;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      margin: 0 60px 0 0;
      &-header {
        width: 95%;
        height: 15px;
        text-align: left;
        margin: 10px auto;
        img{
          margin-left:20px;
        }
      }
      &-body {
        width: 100%;
        text-align: center;
        margin: 0 auto;
        height: 80px;
        .item-text {
          font-size: 40px;
          padding: 0;
          margin: 13px;
        }
      }
      &-footer {
        width: 100%;
        cursor: pointer;
        text-align: center;
        margin: 18px auto;
        height: 44px;
        border-radius: 0 0 10px 10px;
        line-height: 52px;
        color: #fff;
      }
    }
  }

  .charts {
    margin: 20px auto;
    width: 100%;
    height: 320px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 10px;
  }

  .bgBlue {
    background: #409eff;
  }

  .fastIns {
    width: 100%;
    height: 280px;
    margin: 10px auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    &-left {
      width: 48%;
      height: 100%;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      &-header {
        width: 98%;
        text-align: left;
        margin-top: 10px;
        text-indent: 25px;
        span {
          font-size: 14px;
        }
      }
      &-body {
        width: 95%;
        height: 200px;
        margin: 5px auto;
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        flex-wrap:wrap;
        .left-body-items {
          width: 45%;
          height: 100px;
          margin:10px;
          border-radius: 10px;
          background: #fff;
          transition: all .2s linear;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
      }
    }
    &-right {
      width: 48%;
      height: 100%;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
  }

  .flowItem {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition: all .2 linear;
    &-circle {
      width:62px;
      height: 62px;
      text-align: center;
      border-radius: 62px;
      transition: all .2 linear;
      img {
        display: inline-block;
        margin-top: 13px;
      }
    }
  }

  .left-body-items:hover{
    background: #409eff;
    color: #fff;
    cursor: pointer;
    .flowItem-circle {
      background: #fff;
    }
  }

  .topbar-item:hover {
    background: #409eff;
    color: #fff;
    .topbar-item-footer {
      background: rgba(255, 255, 255, 0.2);
      transition: all .2s ease-in-out;
    }
  }

</style>

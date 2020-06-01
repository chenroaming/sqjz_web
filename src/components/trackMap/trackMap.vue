<template>
  <el-dialog
    title="矫正人员轨迹"
    :visible.sync="dialogVisible"
    width="60%">
    <div class="title">
      <span style="margin-right: 20px;">姓名：{{userInfo.name}}</span>
      <el-date-picker
        v-model="dateTime"
        type="date"
        placeholder="选择日期"
        :default-value="today"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <baidu-map class="bm-view"
      :key="isClose"
      ak="DvoyV7vtMIgqmpM0UM7Xg0Yd0MyUyvi8"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      v-if="isMap">
      <bm-marker v-for="(item,index) in traceList" :key="item.trackId" :position="{lng: item.longitude, lat: item.latitude}" @click="showDetail(index)">
        <bm-label :content="'轨迹点' + (index + 1)" :labelStyle="{color: 'blue', fontSize : '12px'}" :offset="{width: -35, height: 30}"></bm-label>
        <bm-polyline :path="polylinePath" stroke-color="#31A5FC" :stroke-opacity="0.5" :stroke-weight="2"></bm-polyline>
        <bm-info-window :position="{lng: item.longitude, lat: item.latitude}" :show="item.isShow" @close="infoWindowClose(index)">
          <p>地址：{{item.location}}</p>
          <p>时间：{{item.createDate}}</p>
        </bm-info-window>
      </bm-marker>
    </baidu-map>
    <p v-if="!isMap" style="text-align: center;">暂无轨迹记录</p>
  </el-dialog>
</template>

<script>
import { BaiduMap,BmMarker,BmLabel,BmPolyline,BmInfoWindow } from 'vue-baidu-map'
import { getTrackRecord } from '@/api/user'
export default {
  name:'trackMap',
  components: {
    BaiduMap,
    BmMarker,
    BmLabel,
    BmPolyline,
    BmInfoWindow
  },
  props:{
    
  },
  data() {
    return {
      isClose:false,//触发地图组件初始化
      dialogVisible:false,
      traceList:[],
      polylinePath:[],
      userInfo:{
        userId:'',
        name:'',
      },
      dateTime:'',
      center: {},//初始显示城市，也可以用经纬度
      zoom: 12,//缩放比例
      today:new Date(),
    };
  },
  mounted(){
    
  },
  computed:{
    isMap(){
      return this.traceList.length > 0 ? true : false;
    },
  },
  methods: {
    show(userInfo){
      this.isClose = !this.isClose;
      this.userInfo = userInfo;
      const myDate = new Date();
      this.dateTime = `${myDate.getFullYear()}-${myDate.getMonth()+1}-${myDate.getDate()}`;
      this.getTrackPoint(this.dateTime);
      this.dialogVisible = true;
    },
    getTrackPoint(dateTime = ''){
      getTrackRecord(this.userInfo.userId,dateTime).then(res => {
        this.center = res.data.state == 100 ? {lng:res.data.list[0].longitude, lat:res.data.list[0].latitude} : {};
        this.traceList = res.data.state == 100 ? res.data.list.map(item => {
          return {
            ...item,
            createDate:this.exChange(item.createDate.time),
            isShow:false,
          }
        }) : [];//轨迹点数组
        this.polylinePath = res.data.state == 100 ? res.data.list.map(item => {//连线经纬度数组
          return {
            lng:item.longitude,
            lat:item.latitude
          }
        }) : [];
      })
    },
    exChange(time){
      const myDate = new Date(time);
      return `${myDate.getFullYear()}-${(myDate.getMonth()+1)}-${myDate.getDate()}   ${myDate.getHours()}:${myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()}`;
    },
    search(){
      this.getTrackPoint(this.dateTime);
    },
    showDetail(index){
      this.traceList[index].isShow = true;
    },
    infoWindowClose(index){
      this.traceList[index].isShow = false;
    },
  },
}
</script>

<style lang="scss">
  .bm-view {
    width: 100%;
    height: 500px;
  }
  .title{
    width: 100%;
    height: 60px;
  }
</style>
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="矫正对象轨迹"
    width="60%">
    <div class="title">
      <span style="margin-right: 20px;">姓名：{{ userInfo.name }}</span>
      <el-date-picker
        v-model="dateTime"
        :default-value="today"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"/>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <baidu-map
      v-if="isMap"
      :key="isClose"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      class="bm-view"
      ak="DvoyV7vtMIgqmpM0UM7Xg0Yd0MyUyvi8">
      <bm-marker v-for="(item,index) in traceList" :key="item.trackId" :position="{lng: item.coordinate.lng, lat: item.coordinate.lat}" @click="showDetail(index)">
        <bm-label :content="'轨迹点' + (index + 1)" :label-style="{color: 'blue', fontSize : '12px'}" :offset="{width: -35, height: 30}"/>
        <bm-polyline :path="polylinePath" :stroke-opacity="0.5" :stroke-weight="2" stroke-color="#31A5FC"/>
        <bm-info-window :position="{lng: item.longitude, lat: item.latitude}" :show="item.isShow" @close="infoWindowClose(index)">
          <p>地址：{{ item.location }}</p>
          <p>时间：{{ item.createDate }}</p>
        </bm-info-window>
      </bm-marker>
    </baidu-map>
    <p v-if="!isMap" style="text-align: center;">暂无轨迹记录</p>
  </el-dialog>
</template>

<script>
import { BaiduMap, BmMarker, BmLabel, BmPolyline, BmInfoWindow } from 'vue-baidu-map'
import { getTrackRecord } from '@/api/user'
import mixin from '@/utils/mixins'
export default {
  name: 'TrackMap',
  components: {
    BaiduMap,
    BmMarker,
    BmLabel,
    BmPolyline,
    BmInfoWindow
  },
  mixins: [mixin],
  props: {

  },
  data() {
    return {
      isClose: false, // 触发地图组件初始化
      dialogVisible: false,
      traceList: [],
      polylinePath: [],
      userInfo: {
        userId: '',
        name: ''
      },
      dateTime: '',
      center: {}, // 初始显示城市，也可以用经纬度
      zoom: 12, // 缩放比例
      today: new Date()
    }
  },
  computed: {
    isMap() {
      return this.traceList.length > 0
    }
  },
  mounted() {

  },
  methods: {
    show(userInfo) {
      this.isClose = !this.isClose
      this.userInfo = userInfo
      const myDate = new Date()
      this.dateTime = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`
      this.$emit('update:done', '')
      this.getTrackPoint(this.dateTime)
      this.dialogVisible = true
    },
    getTrackPoint(dateTime = '') {
      getTrackRecord(this.userInfo.userId, dateTime).then(({ data: { state, list }}) => {
        this.center = state == 100 ? { lng: list[0].longitude, lat: list[0].latitude } : {}
        this.traceList = state == 100 ? list.map(item => {
          return {
            ...item,
            coordinate: this.MapTransBMap(item.longitude, item.latitude),
            createDate: this.exChange(item.createDate.time),
            isShow: false
          }
        }) : []// 轨迹点数组
        this.polylinePath = state == 100 ? list.map(item => { // 连线经纬度数组
          return {
            lng: item.longitude,
            lat: item.latitude
          }
        }) : []
      })
    },
    exChange(time) {
      const myDate = new Date(time)
      return `${myDate.getFullYear()}-${(myDate.getMonth() + 1)}-${myDate.getDate()}   ${myDate.getHours()}:${myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()}`
    },
    search() {
      this.getTrackPoint(this.dateTime)
    },
    showDetail(index) {
      this.traceList[index].isShow = true
    },
    infoWindowClose(index) {
      this.traceList[index].isShow = false
    }
  }
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

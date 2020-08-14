<!--
使用说明:
   v-on:  map-confirm,参数为array数组,传递经纬度值
   v-on   cancel    取消时发出事件
-->
<template>
  <div v-if="value" class="mapBox">
    <div class="minibox" style="width:60%">
      <h3>请设置区域位置 (点击所在位置即可)</h3>
      <div style="padding-top:0px; border:1px solid gray;">
        <baidu-map
          :style="mapStyle"
          :center="center"
          :zoom="zoom"
          :scroll-wheel-zoom="true"
          class="bm-view"
          ak="DvoyV7vtMIgqmpM0UM7Xg0Yd0MyUyvi8"
          map-type="BMAP_NORMAL_MAP"
          @moving="syncCenterAndZoom"
          @moveend="syncCenterAndZoom"
          @zoomend="syncCenterAndZoom"
          @ready="handler"
          @click="choicePoint"
        >
          <bm-view style="width: 100%; height:500px;" />
          <bm-marker
            :position="{lng: center.lng, lat: center.lat}"
            :dragging="true"
            animation="BMAP_ANIMATION_BOUNCE"
          >
            <bm-label
              :content="'选中位置:' + locationName"
              :offset="{width:-20, height: 30}"
              label-style="{color: 'red', fontSize : '10px'}"
            />
          </bm-marker>
          <bm-control offset="{width: '10px', height: '10px'}">
            <bm-auto-complete v-model="keyword" :sug-style="{zIndex: 999999}">
              <input type="text" placeholder="请输入搜索关键字" class="serachinput" >
            </bm-auto-complete>
          </bm-control>
          <bm-local-search
            :keyword="keyword"
            :auto-viewport="true"
            :select-first-result="true"
            style="width:0px;height:0px;overflow: hidden;"
            @searchcomplete="text2"
          />

          <bm-geolocation
            :show-address-bar="true"
            :auto-location="true"
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            @locationSuccess="text"
          />

          <bm-copyright
            :copyright="[{id: 1, content: '纵横集团', bounds: {ne: {lng: 110, lat: 40}, sw:{lng: 0, lat: 0}}}, {id: 2, content: '<a>纵横集团</a>'}]"
            anchor="BMAP_ANCHOR_TOP_RIGHT"
          />
        </baidu-map>
      </div>
      <div slot="footer" style="text-align:right;padding-right:10px;margin-top:15px;">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
    <!-- </el-dialog>  -->
  </div>
</template>
<script>
import {
  BaiduMap,
  BmControl,
  BmView,
  BmAutoComplete,
  BmLocalSearch,
  BmMarker,
  BmGeolocation,
  BmCopyright,
  BmLabel
} from 'vue-baidu-map'
export default {
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmLocalSearch,
    BmMarker,
    BmGeolocation,
    BmCopyright,
    BmLabel
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    mapHeight: {
      type: Number,
      default: 500
    }
  },
  data: function() {
    return {
      showMapComponent: this.value,
      keyword: '',
      mapStyle: {
        width: '100%',
        height: this.mapHeight + 'px'
      },
      center: { lng: 118.184633, lat: 24.493337 },
      zoom: 19,
      mapObj: '',
      geoCoder: null,
      locationName: ''
    }
  },
  watch: {
    value(currentValue, oldValue) {
      this.showMapComponent = currentValue
      currentValue && (this.keyword = '')
    }
  },
  methods: {
    text2(results) {
      // console.log("触发搜索完成");
      if (results != undefined) {
        try {
          console.log(results.Ir[0])
          this.center.lng = results.Ir[0].point.lng
          this.center.lat = results.Ir[0].point.lat
          this.dw = results.Ir[0].address + '(' + results.Ir[0].address + ')'
        } catch (err) {
          console.error(err)
        }
      }
    },

    text({ point, AddressComponent, marker }) {
      console.log(point)
      // console.log("触发定位");
      this.center.lng = point.lng
      this.center.lat = point.lat
    },

    // 地图初始化
    handler({ BMap, map }) {
      this.mapObj = map
      this.geoCoder = new BMap.Geocoder()
      //  this.mapObj.disableDragging();
      // eslint-disable-next-line no-unused-vars
      const _this = this
    },
    choicePoint(e) {
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
      this.geoCoder.getLocation(e.point, res => {
        if (res.surroundingPois.length > 0) {
          this.locationName = res.surroundingPois[0].title
          this.dw = res.surroundingPois[0].title
        }
      })
    },
    /** *
     * 地图点击事件。
     */
    changeCenter(e) {
      // console.log("触发changeCenter");
    },
    syncCenterAndZoom(e) {
      // console.log("触发syncCenterAndZoom");
      const { lng, lat } = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
    /** *
     * 确认
     */
    confirm() {
      this.showMapComponent = false
      const obj = {
        lng: this.center.lng,
        lat: this.center.lat,
        dw: this.dw ? this.dw : '未识别的经纬度信息'
      }
      this.$emit('map-confirm', obj)
    },
    /** *
     * 取消
     */
    cancel() {
      this.showMapComponent = false
      this.center = { lng: 118.184633, lat: 24.493337 }
      this.$emit('cancel', this.showMapComponent)
    },
    initCenter(val) {
      console.log('默认中心' + val)
      if (val[0] != undefined && val[0] != '' && val[0] != null) {
        this.center.lng = val[0]
      }
      if (val[1] != undefined && val[1] != '' && val[1] != null) {
        this.center.lat = val[1]
      }
    }
  }
}
</script>

<style scoped>
.serachinput {
  width: 300px;
  box-sizing: border-box;
  padding: 9px;
  border: 1px solid #dddee1;
  line-height: 20px;
  font-size: 16px;
  height: 38px;
  color: #333;
  position: relative;
  border-radius: 4px;
  -webkit-box-shadow: #666 0px 0px 10px;
  -moz-box-shadow: #666 0px 0px 10px;
  box-shadow: #666 0px 0px 10px;
}
.mapBox {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.minibox {
  background-color: white;
  padding-top: 20px;
  padding-bottom: 20px;
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
}
.minibox h3 {
  text-align: center;
  margin: 0;
  margin-bottom: 15px;
}
</style>

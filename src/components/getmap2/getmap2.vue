<template>
  <div>
    <baidu-map ak="DvoyV7vtMIgqmpM0UM7Xg0Yd0MyUyvi8" :center="center" :zoom="zoom" @ready="handler"></baidu-map>
  </div>
</template>

<script>
import {
  BaiduMap,
  BmControl,
  BmView,
  BmAutoComplete,
  BmLocalSearch,
  BmMarker
} from "vue-baidu-map";

export default {
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmLocalSearch,
    BmMarker
  },
  props: {
    value: Boolean,
    mapHeight: {
      type: Number,
      default: 500
    }
  },
  data: function() {
    return {
      showMapComponent: this.value,
      //   keyword: "",
      mapStyle: {
        width: "100%",
        height: this.mapHeight + "px"
      },
      center: { lng: 118.184633, lat: 24.493337 },
      zoom: 19
    };
  },
  watch: {},
  methods: {
    handler({ BMap, map }) {
      console.log("触发");
      console.log(BMap, map);
      this.center.lng = 116.404;
      this.center.lat = 39.915;
      this.zoom = 15;
    }
  }
};
</script>


<style scoped>
</style>
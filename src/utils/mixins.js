const mixin = {

  data() {
    return {
      baseUrl: '/face_recognition/webAdmin/validateCode.jhtml',
      codeUrl: '/face_recognition/webAdmin/validateCode.jhtml'
    }
  },
  // 抽象出切换验证码方法
  methods: {
    changeCodeUrl() {
      this.codeUrl = this.baseUrl + '?' + Math.ceil(Math.random(0, 100) * 100)
    },
    // 高德地图经纬度转换为百度地图经纬度
    MapTransBMap(lng, lat) {
      const x_pi = (3.14159265358979324 * 3000.0) / 180.0
      const x = lng
      const y = lat
      const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
      const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
      const lngs = z * Math.cos(theta) + 0.0065
      const lats = z * Math.sin(theta) + 0.006

      return {
        lng: lngs,
        lat: lats
      }
    }
  }
}

export default mixin

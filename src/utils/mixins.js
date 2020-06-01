const mixin = {

  data () {
    return {
      baseUrl: '/face_recognition/webAdmin/validateCode.jhtml',
      codeUrl: '/face_recognition/webAdmin/validateCode.jhtml',
    }
  },
  // 抽象出切换验证码方法
  methods: {
    changeCodeUrl () {
      this.codeUrl = this.baseUrl + '?' + Math.ceil(Math.random(0,100)*100);
    },
  }
}

export default mixin;
<template>
  <div class="main" style="padding: 30px;">
    <h1>身份证扫描模块</h1>
    <div class="demo-image__placeholder" style="width: 400px;">
      <div class="block">
        <span class="demonstration">身份证信息:</span>
        <el-image :src="src" />
      </div>
    </div>

    <el-button @click="saomiao()">测试扫描</el-button>
    <el-button @click="request()">清空</el-button>
  </div>
</template>
<script>
import { CertCtl_connect, CertCtl_readCert } from '@/api/smtext'
export default {
  data() {
    return {
      src: 'https://rt.ptnetwork001.com/resource/succeed.png'
    }
  },
  mounted() {
    this.__init()
  },
  methods: {
    request() {
      this.src = 'https://rt.ptnetwork001.com/resource/succeed.png'
    },
    __init() {
      //   alert("调用");
      CertCtl_connect()
        .then(res => {
          // console.log(res);
          if (res.data.resultFlag == 0) {
            // alert("设备连接成功");
            this.$message({
              message: '设备连接成功',
              type: 'success'
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.data.errorMsg
            })
          }
        })
        .catch(err => {
          console.log(err)
          // alert('触发')
        })
    },
    saomiao() {
      // alert("测试");
      CertCtl_readCert()
        .then(res => {
          // console.log(res);
          if (res.data.resultFlag == 0) {
            this.src =
              'data:image/jpeg;base64,' +
              res.data.resultContent.identityPrintPic
          } else {
            this.$message({
              type: 'warning',
              message: res.data.errorMsg
            })
          }
        })
        .catch(err => {
          console.log(err)
          // alert('触发')
        })
    }
  }
}
</script>

<style scoped>
.main {
  /* border: 1px solid; */
  padding: 30px;
}
</style>

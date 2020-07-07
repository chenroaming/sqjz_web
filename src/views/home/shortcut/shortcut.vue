<script>
export default {
  name: 'Shortcut',
  data() {
    return {
      bodyStyle: {
        textAlign: 'center'
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card {
  width: 100%;
  height: 200px;
  // float: left;
  margin-right: 2%;
}
.r_c {
  display: flex;
  justify-content: right;
  align-items: baseline;
}
.c_c {
  display: flex;
  justify-content: center;
  align-items: center;
}
.c_cz {
  border-radius: 10px;
  margin: 0 auto;
  width: 80%;
  box-shadow: 0px 1px 8px #888888;
  // border: 1px solid #666;
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <el-card :body-style="bodyStyle" class="box-card">
    <div slot="header" class="r_c">
      <h3 style="color: #666666;margin:0">快捷方式</h3>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <router-link :to="{ path:'/Communityuser/index'}" style="margin-right:15px;">
            <div class="c_cz">
              <img src="../../../assets/index_images/dz.png" style="width:50px;height:50px;" >
              <span style="margin-top:15px;">
                <b>矫正电子档案</b>
              </span>
            </div>
          </router-link>
        </el-col>
        <el-col :span="8">
          <router-link :to="{ path:'/warningInfo'}" style="margin-right:15px;">
            <div class="c_cz">
              <img src="../../../assets/index_images/pj.png" style="width:50px;height:50px;" >
              <span style="margin-top:15px;">
                <b>预警信息管理</b>
              </span>
            </div>
          </router-link>
        </el-col>
        <el-col :span="8">
          <a class="c_cz" href="https://www.ecorrect.cn/#/Visualization" target="_blank">
            <img src="../../../assets/index_images/ksh.png" style="width:50px;height:50px;" >
            <span style="margin-top:15px;">
              <b>可视化平台</b>
            </span>
          </a>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

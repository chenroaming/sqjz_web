<script>
export default {
  name: "shortcut",
  data() {
    return {
      bodyStyle: {
        // padding:'50px 145px'
        textAlign: "center"
      }
    };
  },
  computed: {},
  mounted() {},

  methods: {
    Communityuser() {
      this.$router.push("/Communityuser/index");
    },
    Visualization() {
      this.$router.push("/Visualization");
    },
    yd() {
      this.$message.error("该功能暂未开放");
      return false;
    }
  }
};
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
  <el-card class="box-card" :body-style="bodyStyle">
    <div slot="header" class="r_c">
      <h3 style="color: #666666;margin:0">快捷方式</h3>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="c_cz" @click="Communityuser">
            <img src="../../../assets/index_images/dz.png" style="width:50px;height:50px;" />
            <span style="margin-top:15px;">
              <b>矫正电子档案</b>
            </span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="c_cz" @click="yd">
            <img src="../../../assets/index_images/pj.png" style="width:50px;height:50px;" />
            <span style="margin-top:15px;">
              <b>每月评估报告</b>
            </span>
          </div>
          <!-- <el-button type="primary" disabled>每月评估报告</el-button> -->
        </el-col>
        <el-col :span="8">
          <a class="c_cz" href="https://www.ecorrect.cn/#/Visualization" target="_blank">
            <img src="../../../assets/index_images/ksh.png" style="width:50px;height:50px;" />
            <span style="margin-top:15px;">
              <b>可视化平台</b>
            </span>
          </a>
        </el-col>
      </el-row>
    </div>
    <!-- <router-link style="margin-right:15px;" :to="{ path:'/Communityuser/index'}">
      <el-button type="primary">矫正电子档案</el-button>
    </router-link>
    <el-button type="primary" disabled>每月评估报告</el-button>
    <el-button type="primary">
      <a href="https://www.ecorrect.cn/#/Visualization" target="_blank">可视化平台</a>
    </el-button>-->
  </el-card>
</template>
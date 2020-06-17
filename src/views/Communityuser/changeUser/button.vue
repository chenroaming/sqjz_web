<script>
import trackMap from "@/components/trackMap/trackMap.vue"
import record from "./record/record.vue"
import wrinfo from "./record/wrinfo.vue"
import ramdomTask from "./record/ramdomTask.vue"
import warninginfo from "./record/warninginfo.vue"
import faceInfo from "./record/faceInfo.vue"
export default {
  name: "buttonBox",
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    trackMap,
    record,
    wrinfo,
    ramdomTask,
    warninginfo,
    faceInfo
  },
  data() {
    return {
      userId: "",
      bodyStyle:{
        padding: '10px'
      }
    };
  },
  methods: {
    handleUserCurd(modalType) {
      const { userId } = this.userInfo
      const action = new Map([
        ["LOOK_TRACK",() => {//轨迹记录
          const authInfo = {
            userId: userId,
            name: this.userInfo.name
          };
          this.$refs.trackMap.show(authInfo)
        }],
        ["LOOK_COUNT",() => {//日常报告记录
          this.$refs.record.show(userId)
        }],
        ["LOOK_WRINFO",() => {//书面报告记录
          this.$refs.wrinfo.show(userId)
        }],
        ["LOOK_RAMDOMTask",() => {//随机抽查记录
          this.$refs.ramdomTask.show(userId)
        }],
        ["LOOK_WRANINGINFO",() => {//违规预警记录
          this.$refs.warninginfo.show(userId)
        }],
        ["LOOK_FACEINFO",() => {//人脸识别记录
          this.$refs.faceInfo.show(userId)
        }],
      ])
      return action.get(modalType)()
    }
  }
};
</script>

<style lang="scss" scoped>
  .box-card {
    width: 100%;
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
    padding: 10px;
    cursor: pointer;
    display: flex;
    font-size: 12px;
    /* flex-direction: column; */
    justify-content: center;
    align-items: center;
  }
  .el-row {
    margin-bottom: 10px;
  }
</style>

<template>
  <el-card class="box-card" :body-style="bodyStyle" shadow="never">
    <div slot="header">
      <span>操作</span>
    </div>
    <el-row :gutter="5">
      <el-col :span="8">
        <div class="c_cz" @click="handleUserCurd('LOOK_TRACK')">
          <img
            src="../../../assets/index_images/dz.png"
            style="width:20px;height:20px;"
          />
          <span style="margin-left:5px">
            <b>查看轨迹</b>
          </span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="c_cz" @click="handleUserCurd('LOOK_COUNT')">
          <img
            src="../../../assets/index_images/pj.png"
            style="width:20px;height:20px;"
          />
          <span style="margin-left:5px">
            <b>日常报告</b>
          </span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="c_cz" @click="handleUserCurd('LOOK_WRINFO')">
          <img
            src="../../../assets/index_images/sm.png"
            style="width:20px;height:20px;"
          />
          <span style="margin-left:5px">
            <b>书面报告</b>
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <div class="c_cz" @click="handleUserCurd('LOOK_RAMDOMTask')">
          <img
            src="../../../assets/index_images/sj.png"
            style="width:20px;height:20px;"
          />
          <span style="margin-left:5px">
            <b>随机抽查</b>
          </span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="c_cz" @click="handleUserCurd('LOOK_WRANINGINFO')">
          <img
            src="../../../assets/index_images/wg.png"
            style="width:20px;height:20px;"
          />
          <span style="margin-left:5px">
            <b>违规预警</b>
          </span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="c_cz" @click="handleUserCurd('LOOK_FACEINFO')">
          <img
            src="../../../assets/index_images/rl.png"
            style="width:20px;height:20px;"
          />
          <span style="margin-left:5px">
            <b>人脸识别</b>
          </span>
        </div>
      </el-col>
    </el-row>
    <trackMap ref="trackMap"></trackMap>
    <record ref="record" :userId="userId"></record>
    <wrinfo ref="wrinfo" :userId="userId"></wrinfo>
    <ramdomTask ref="ramdomTask" :userId="userId"></ramdomTask>
    <warninginfo ref="warninginfo" :userId="userId"></warninginfo>
    <faceInfo ref="faceInfo" :userId="userId"></faceInfo>
  </el-card>
</template>

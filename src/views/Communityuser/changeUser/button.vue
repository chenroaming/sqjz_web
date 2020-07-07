<script>
import trackMap from '@/components/trackMap/trackMap'
import record from './record/record'
import wrinfo from './record/wrinfo'
import ramdomTask from './record/ramdomTask'
import warninginfo from './record/warninginfo'
import faceInfo from './record/faceInfo'
import resetPhone from './record/resetPhone'
import evaluationInfo from './record/evaluationInfo'
import monthReport from './record/monthReport'
import authmix from '@/utils/authmix'
// import test from './record/test'
export default {
  name: 'ButtonBox',
  components: {
    trackMap,
    record,
    wrinfo,
    ramdomTask,
    warninginfo,
    faceInfo,
    resetPhone,
    evaluationInfo,
    monthReport
    // test
  },
  mixins: [authmix],
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isLoading: '',
      bodyStyle: {
        padding: '10px'
      },
      buttonArr: [
        // { span: 8, item: 'trackMap', picSrc: require('../../../assets/index_images/dz.png'), auth: 'user:findTrackRecord', text: '查看轨迹' },
        { span: 8, item: 'record', picSrc: require('../../../assets/index_images/pj.png'), auth: 'user:admin', text: '日常报告' },
        { span: 8, item: 'wrinfo', picSrc: require('../../../assets/index_images/sm.png'), auth: 'user:admin', text: '书面报告' },
        { span: 8, item: 'ramdomTask', picSrc: require('../../../assets/index_images/sj.png'), auth: 'user:admin', text: '随机抽查' },
        { span: 8, item: 'warninginfo', picSrc: require('../../../assets/index_images/wg.png'), auth: 'user:admin', text: '违规预警' },
        { span: 8, item: 'faceInfo', picSrc: require('../../../assets/index_images/rl.png'), auth: 'user:admin', text: '人脸识别' },
        { span: 8, item: 'evaluationInfo', picSrc: require('../../../assets/index_images/xl.png'), auth: 'user:admin', text: '心理测评' },
        { span: 8, item: 'monthReport', picSrc: require('../../../assets/index_images/yd.svg'), auth: 'user:admin', text: '月度报告' }
      ]
    }
  },
  computed: {
    filterList() {
      return this.buttonArr
        .filter(item => this.checkPermission([item.auth])) // 按钮根据权限过滤显示
    }
  },
  methods: {
    handleUserCurd(modalType) {
      this.isLoading = modalType
      const { userId, name } = this.userInfo
      if (modalType === 'trackMap') { // 轨迹记录比较特殊，单独处理
        const authInfo = {
          userId: userId,
          name: name
        }
        this.$refs[modalType].show(authInfo)
        return true
      }
      this.$refs[modalType].show()
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    width: 100%;
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
  .el-col {
    margin-bottom: 10px;
  }
</style>

<template>
  <el-card :body-style="bodyStyle" class="box-card" shadow="never">
    <div slot="header">
      <span>操作</span>
    </div>
    <el-row :gutter="5">
      <el-col v-for="item in filterList" :span="item.span" :key="item.item">
        <div v-loading="isLoading === item.item" class="c_cz" @click="handleUserCurd(item.item)">
          <img
            :src="item.picSrc"
            style="width:20px;height:20px;"
          >
          <span style="margin-left:5px">
            <b>{{ item.text }}</b>
          </span>
        </div>
      </el-col>
      <!-- <resetPhone :user-id="userInfo.userId"/> -->
      <!-- <test/> -->
    </el-row>
    <trackMap ref="trackMap" :done.sync="isLoading"/>
    <record ref="record" :user-id="userInfo.userId" :done.sync="isLoading"/>
    <wrinfo ref="wrinfo" :user-id="userInfo.userId" :done.sync="isLoading"/>
    <ramdomTask ref="ramdomTask" :user-id="userInfo.userId" :done.sync="isLoading"/>
    <warninginfo ref="warninginfo" :user-id="userInfo.userId" :done.sync="isLoading"/>
    <faceInfo ref="faceInfo" :user-id="userInfo.userId" :done.sync="isLoading"/>
    <evaluationInfo ref="evaluationInfo" :user-id="userInfo.userId" :done.sync="isLoading"/>
    <monthReport ref="monthReport" :user-id="userInfo.userId" :done.sync="isLoading"/>
  </el-card>
</template>

<template>
  <div
    v-if="authDrawerVisible"
    :class="authDrawerVisible?'auth-animateFadeIn':''"
    class="auth-mask"
    @click="closeModal"
  >
    <el-button
      type="danger"
      icon="el-icon-close"
      circle
      class="closeBtn"
      size="mini"
      @click.stop
      @click="closeModal"
    />

    <transition :appear="true" name="slideIn" mode="out-in">
      <div v-loading="isLoadingEnd" class="auth-wrap" @click.stop>
        <div class="wrap-header">
          <h3 class="primary">矫正轨迹查看</h3>
        </div>
        <div class="wrap-user">
          <p>人员姓名：{{ authInfo.name }}</p>
          <div class="dvideLine" />
        </div>

        <div v-if="traceList.length == 0" class="loading" style="margin-left:30px;">
          <p style="color:#409eff">暂无相关记录！</p>
        </div>

        <div v-if="traceList.length != 0" class="content">
          <!-- <trackMap ref="getmapRefs" :traceList="traceList"></trackMap> -->
          <!-- <el-timeline>
            <el-timeline-item
              v-for="(item, index) in traceList"
              :key="index"
              :timestamp="item.captureTime"
              placement="top"
            >
              <span class="traceWebcamName">{{ item.position }}</span>
              <el-card>
                <img
                  :src="item.picPath"
                  style="width: 100px;cursor: pointer;"
                  alt
                  class="timelinePhoto"
                  @click="handleLookLphoto(item.picPath)"
                > -->
                <!-- <h4>{{ item.name }} （{{ item.gender === '0'? '男' : '女'}}）</h4> -->
                <!-- <h4>位置：{{ item.location }}</h4> -->

                <!-- <h4 v-if="item.plateType == 0">
                  车识别类型：
                  <span style="color: green;">真实车牌</span>
                </h4>
                <h4 v-if="item.plateType === 1">
                  车识别类型：
                  <span style="color: red;">伪车牌</span>
                </h4>
                <h4 v-if="item.plateType === 2">车识别类型：未知车牌</h4>-->
                <!-- <p>姓名:{{ item.name }}</p>
                <p>时间:{{ item.createDate | setLastLoginTime }}</p> -->
                <!-- <p>相似度：{{ item.similarity | similarityPercent }}</p> -->
              <!-- </el-card>
            </el-timeline-item>
          </el-timeline> -->
          <!-- <Sortpage
            :total-pages="totalPage"
            :current-page="currentPage"
            @sizeChange="handleSortPage"
          /> -->
        </div>

        <!-- <el-button type="primary" class="submitButton" round @click.stop @click="confirmAuth">提交</el-button> -->
      </div>
    </transition>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import trackMap from "@/components/trackMap/trackMap.vue";
import { getUserAuth, changeUserAuth, getTrackRecord } from '@/api/user'
import { computedFormatTime } from '@/utils/tools'
// import Sortpage from '@/components/sortpage/sortpage' // 分页组件
export default {
  components: {
    // Sortpage,
    trackMap
  },
  // filters: {
  //   // 高亮已有权限项文字
  //   hightLightItem(val) {
  //     if (val === undefined) return ''
  //     return 'hightLightItem'
  //   },
  //   // 格式化登录时间
  //   setLastLoginTime(timeObj) {
  //     if (timeObj === null) return ''
  //     return computedFormatTime(timeObj.time)
  //   }
  // },

  props: {
    // 抽屉状态
    authDrawerVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      totalPage: 0, // 总页数
      pageNumber: 1, // 当前页数
      currentPage: 0,
      isLoading: true,
      traceList: [],
      showMap:true,
      // 打印轨迹
      // allAuthList: [], // 所有权限集合
      // userAuthList: [], // 用户所持有权限集合
      // allFaceAuthList: [], // 人脸库集合
      // userFaceFindList: [], // 用户查询人脸库集合
      isLoadingEnd: false,
      tabPosition: 'manger',
      checked: true,
      authInfo: {
        adminId: 1,
        username: '',
        name: ''
      }
    }
  },
  methods: {
    // 关闭抽屉
    closeModal() {
      this.$emit('closeModal')
    },
    // 分页
    handleSortPage(num) {
      console.log(num)
      this.pageNumber = num
      this.isLoading = true
      // this.traceList = [];
      this.getList()
    },

    getList() {
      getTrackRecord('10', this.pageNumber, this.authInfo.userId)
        .then(res => {
          // console.log(res);
          if (res.data.state == 100) {
            this.traceList = res.data.list
            // this.totalPage = res.data.total
            // this.pageNumber = res.data.pageNumber
          } else {
            this.traceList = []
          }
          this.isLoadingEnd = false // 关闭加载Circle
        })
        .catch(() => {
          this.isLoadingEnd = false // 关闭加载Circle
        })
    },
    // 获取用户权限
    getUserAuthList(authInfo) {
      this.isLoadingEnd = true
      // this.resetList()
      // console.log(authInfo);
      this.traceList = []
      this.authInfo = { ...authInfo }
      this.getList()
    },
    // getPoint(val) {
    //   this.showMap = false;
    //   console.log(val);
    //   console.log("现在的坐标是");
    // },
    cancelPoint() {
      this.showMap = false;
    },
    // // 确认提交修改
    // confirmAuth() {
    //   let arr = []
    //   this.userAuthList.forEach((val, index) => {
    //     if (val.hasSelectItem.length !== 0) {
    //       arr.push(val.authorityCode)
    //       arr = arr.concat(val.hasSelectItem)
    //     }
    //   })
    //   this.submitAuthList(arr)
    // },

    // 正式提交
    // submitAuthList(arr) {
    //   this.$confirm('您确认要提交权限与人脸库吗？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       changeUserAuth(this.authInfo.adminId, arr, this.userFaceFindList)
    //         .then(res => {
    //           if (res.data.state === '100') {
    //             this.$message({ type: 'success', message: '修改成功' })
    //             this.$emit('closeModal')
    //           }
    //         })
    //         .catch(() => {})
    //     })
    //     .catch(() => {})
    // },

    // 重置数据
    // resetList() {
    //   this.userAuthList = []
    //   this.allAuthList = []
    //   this.allFaceAuthList = []
    //   this.userFaceFindList = []
    // }
  }
}
</script>

<style lang='scss' scoped>
$primayText: #303133;
$commonText: #606266;
$remainText: #909399;
.auth {
  &-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1998;
    background: rgba(0, 0, 0, 0.5);
  }
  &-wrap {
    width: 600px;
    height: 100%;
    overflow-y: scroll;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1999;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.wrap {
  &-header {
    width: 95%;
    text-align: left;
    margin: 0 auto;
  }
  &-user {
    width: 95%;
    text-align: left;
    margin: 0 auto;
    p {
      color: $commonText;
      font-size: 14px;
    }
  }
  &-userOwnAuth {
    width: 95%;
    margin: 0 auto;
  }
  &-authItem {
    margin: 30px 0 30px 0;
  }
}

.primary {
  color: $primayText;
}

.common {
  color: $commonText;
}

.remain {
  color: $remainText;
}

.hightLightItem {
  color: #409eff;
}

.dvideLine {
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #dcdfe6;
}

.divideLine-item {
  width: 100%;
  height: 1px;
  margin: 30px 0 30px 0;
  border-bottom: 1px solid #eee;
}

.hightLightBar {
  height: 10px;
  margin-right: 4px;
  display: inline-block;
  width: 3px;
  background: #409eff;
}

.closeBtn {
  position: absolute;
  right: 2%;
  top: 2%;
  z-index: 1999;
}

.submitButton {
  position: fixed;
  bottom: 1%;
  width: 200px;
  margin-right: -100px;
  opacity: 0.9;
  right: 15%;
  z-index: 1999;
}

.auth-wrap::-webkit-scrollbar {
  width: 8px;
}

.auth-wrap::-webkit-scrollbar-track {
  background-color: #fff;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

.auth-wrap::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.3);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

.auth-animateFadeIn {
  animation: fadeIn 0.5s forwards;
}

.slideIn-enter,
.slideIn-leave-to {
  right: -600px;
}

.slideIn-enter-active,
.slideIn-leave-active {
  transition: right 0.5s ease;
}

@keyframes fadeIn {
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>

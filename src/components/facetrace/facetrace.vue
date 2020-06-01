<template>
  <div class='auth-mask' v-if="authDrawerVisible" :class="isDrawerOpen?'animateFadeIn':'animateFadeOut'"
    @click="handleCloseSelect">
    <div class='Wrap' :class="isDrawerOpen?'animateSlideIn':'animateSlideOut'" @click.stop>
      <div class='close'>
        <el-button circle icon="el-icon-close" type="danger" size="mini" @click="handleClose"></el-button>
      </div>
      <div class='loading' v-if="isLoading">
        <div class='loading-circle'></div>
        <p>加载中...</p>
      </div>
      <div class='loading' v-if="isNoTrace">
        <p style="color:#409eff">暂无相关记录！</p>
      </div>
      <div class='content'>
        <el-timeline>
          <el-timeline-item :timestamp=" item.createDate.time | formatTime " placement="top"
            v-for="(item, index) in traceList" :key="index">
            <span class='traceWebcamName'>{{ item.webcamName }}</span>
            <el-card>
              <img style="cursor:pointer" :src="item.lPhoto" alt="" @click="handleLookLphoto(item.lPhoto)"
                class='timelinePhoto'>
              <h4>{{ item.name }} （{{ item.gender === '0'? '男' : '女'}}）</h4>
              <p>相似度：{{ item.similarity | similarityPercent }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <Sortpage :totalPages="totalPage" @sizeChange="handleSortPage" />
    </div>
    <div class='lamp'>
      <img v-show="isShowLphoto" :src="lphotoPath" alt="预览大图" :class="isShowLphoto? 'animateScale' :'animateScaleOut'"
        style="width: 405px;cursor: pointer;height: 720px;">
    </div>


  </div>
</template>

<script>
  import { getSnapShotList } from '@/api/snapshot';
  import { computedFormatTime } from '@/utils/tools';
  import Sortpage from "@/components/sortpage/sortpage"; // 分页组件
  export default {
    props: {
      authDrawerVisible: false,
    },
    // 传输值
    components: {
      Sortpage
    },

    data() {
      return {
        totalPage: 0, // 总页数
        pageNumber: 1, // 当前页数
        isLoading: true,
        traceList: [],
        lphotoPath: '',
        isShowLphoto: false,
        isDrawerOpen: false,
        isNoTrace: false,
      }
    },

    filters: {
      formatTime(val) {
        return computedFormatTime(val);
      },

      // 相似度匹配
      similarityPercent(val) {
        // console.log(val)

        let beforeDot = parseFloat(val).toFixed(4).split('.')[1].slice(0, 2);
        let afterDot = parseFloat(val).toFixed(4).split('.')[1].slice(2, 4);
        return beforeDot + '.' + afterDot + '%';
      }
    },

    methods: {
      // 分页
      handleSortPage(num) {
        this.pageNumber = num;
        this.isLoading = true;
        this.traceList = [];
        this.getList();
      },
      // 关闭抽屉
      handleClose() {
        this.isDrawerOpen = false;
        this.isShowLphoto = false;
        this.timer = setTimeout(() => {
          this.lphotoPath = '';
          this.isNoTrace = false;
          this.traceList = [];
          this.$emit('closeModal');
        }, 300);
      },

      // 获取人脸轨迹
      getFaceTraceList(faceId) {
        this.faceId = faceId;
        this.getList();
      },
      //获取列表
      getList() {
        let pageSize = 10;
        let pageNumber = this.pageNumber;
        let category = '';
        let webcamId = '';
        let faceId = this.faceId;
        this.isDrawerOpen = true;
        getSnapShotList(pageSize, pageNumber, category, webcamId, faceId)
          .then(res => {
            this.traceList = res.data.List;
            this.lphotoPath = res.data.List[0].lPhoto;
            this.pageNumber = res.data.pageNumber;
            this.totalPage = res.data.total;
            this.$notify({
              title: '提示',
              message: '点击小图可查看完整抓拍图',
              position: 'top-left',
              duration: 2000,
            });
            this.isLoading = false;
          })
          .catch(() => {
            this.traceList = [];
            this.isLoading = false;
            this.isNoTrace = true;
          });
      },
      // 查看大图
      handleLookLphoto(path) {
        this.lphotoPath = path;
        this.isShowLphoto = true;
      },

      // 点击遮罩依次关闭
      handleCloseSelect() {
        if (this.isShowLphoto === false) this.handleClose();
        else this.isShowLphoto = false;
      }
    },

    beforeDestroy() {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
</script>

<style lang='scss' scoped>
  .close {
    width: 95%;
    top: 10px;
    text-align: right;
    position: fixed;
    right: 50px;
    z-index: 999;
  }

  .auth-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: 1200;
    background: rgba(0, 0, 0, 0);
  }

  .Wrap {
    width: 10%;
    height: 100%;
    float: right;
    background: #fff;
    position: relative;
    right: 0px;
    overflow-y: auto;

    .loading {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.5);

      &-circle {
        width: 30px;
        height: 30px;
        opacity: 0.5;
        background: #409EFF;
        margin-right: 10px;
        border-radius: 30px;
        animation: circle 1.5s infinite forwards ease-in-out;
      }
    }

    .content {
      width: 100%;
      margin-top: 50px;
    }
  }

  .lamp {
    float: right;
    width: 61%;
    height: 100%;
    position: relative;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;

    img {
      width: 90%;
      cursor: pointer;
    }
  }

  .timelinePhoto {
    width: 50%;
  }

  .animateFadeIn {
    animation: fadeIn .2s forwards ease-in-out;
  }

  .animateSlideIn {
    animation: slideIn .5s forwards ease;
  }

  .animateScale {
    animation: Scale .3s forwards ease-in-out;
  }

  .animateSlideOut {
    animation: slideOut .3s forwards ease-in-out;
  }

  .animateFadeOut {
    animation: fadeOut .3s forwards ease-in-out;
  }

  .animateScaleOut {
    animation: ScaleOut .3s forwards ease-in-out;
  }


  @keyframes fadeIn {
    from {
      background: rgba(0, 0, 0, 0);
    }

    to {
      background: rgba(0, 0, 0, 0.5);
    }
  }

  @keyframes slideIn {
    from {
      width: 0%;
    }

    to {
      width: 30%;
    }
  }

  @keyframes circle {
    0% {
      opacity: 0.5;
      transform: scale(0.5);
    }

    50% {
      opacity: 1;
      transform: scale(1.5);
    }

    100% {
      opacity: 0.5;
      transform: scale(0.5);
    }
  }

  @keyframes Scale {
    0% {
      transform: scale(0.2);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes slideOut {
    from {
      width: 35%;
    }

    to {
      width: 0%;
    }
  }

  @keyframes fadeOut {
    from {
      background: rgba(0, 0, 0, 0.5);
    }

    to {
      background: rgba(0, 0, 0, 0);
    }
  }

  @keyframes ScaleOut {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    100% {
      transform: scale(0);
      opacity: 0;
    }
  }

  .traceWebcamName {
    position: absolute;
    top: 0px;
    right: 5px;
    color: #909399;
  }
</style>
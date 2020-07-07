<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" title="详情" width="60%" append-to-body>
      <el-row>
        <el-col :span="3">
          <span>打卡照片：</span>
        </el-col>
        <el-col :span="21">
          <div class="bigBox">
            <div v-for="(item,index) in picArr" :key="index" class="picBox">
              <el-image
                :src="item"
                style="width: 300px;height: 300px;"/>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <span>打卡视频：</span>
        </el-col>
        <el-col :span="21">
          <video v-if="hasVideo" :src="videoSrc" style="width: 100%;height: 300px;" controls/>
          <span v-else>暂无视频</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <span>矫正人姓名：</span>
        </el-col>
        <el-col :span="9">
          <span>{{ detail.userName }}</span>
        </el-col>
        <el-col :span="3">
          <span>活动地点：</span>
        </el-col>
        <el-col :span="9">
          <span>{{ detail.activityLocation }}</span>
        </el-col>
        <el-col :span="3">
          <span>社区名称：</span>
        </el-col>
        <el-col :span="9">
          <span>{{ detail.communityName }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <span>身份证号码：</span>
        </el-col>
        <el-col :span="9">
          <span>{{ detail.identityCard }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <span>开始时间：</span>
        </el-col>
        <el-col :span="9">
          <span>{{ detail.startDate }}</span>
        </el-col>
        <el-col :span="3">
          <span>结束时间：</span>
        </el-col>
        <el-col :span="9">
          <span>{{ detail.endDate }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <span>电话号码：</span>
        </el-col>
        <el-col :span="9">
          <span>{{ detail.phone }}</span>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ClockDetail',
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      dialogTableVisible2: false,
      direction: 'rtl',
      videoPath: ''
    }
  },
  computed: {
    picArr() {
      return this.detail.picPath ? this.detail.picPath.split(',') : []
    },
    hasVideo() {
      return !!this.detail.videoPath
    },
    videoSrc() {
      return `${location.origin}${this.detail.videoPath}`
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.dialogTableVisible = true
    }
    // showPic(item){
    //   this.videoPath = item.videoPath
    //   this.dialogTableVisible2 = true
    // },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .bigBox{
    width: 100%;
    height: 350px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    text-align: left;
  }
  .picBox{
    display: inline-block;
    width: 300px;
    height: 300px;
    margin-right: 10px;
  }
  .el-row {
    margin-bottom: 8px;
  }
</style>

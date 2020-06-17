<script>
  import { reportTask } from '@/api/user'
  import tablemix from '@/utils/tablemix'
  export default {
    name:'ramdomTask',
    data() {
      return {
        userId:'',
        drawer:false,
        reverse: false,
        activities: [],
        currentPage:1,
        totalPage:0,
        centerDialogVisible:false,
        report:{
          reportContent:'',
          filePath:'',
          signaturePicPath:'',
          date2:''
        }
      };
    },
    mixins:[tablemix],
    mounted(){

    },
    computed:{
      isAudio(){
        return this.report.reportType === 2 ? true : false
      }
    },
    methods: {
      show(userId){
        this.userId = userId
        this.currentPage = 1
        this.getList()
      },
      getColor(text){
        const color = new Map([
          ['系统随机','info'],
          ['位置汇报','success'],
          ['语音汇报','warning']
        ])
        return color.get(text)
      },
      getList(pageNumber = 1){
        const data = {
          userId:this.userId,
          pageNumber:pageNumber,
          pageSize:5
        }
        reportTask(data).then(res => {
          if (res.data.state == 100){
            this.activities = res.data.list.map(item => {
              return {
                ...item,
                createTime: this.exChange(item.createDate.time),
                reportTime: item.reportDate ? this.exChange(item.reportDate.time) : '未报告',
                reportText: item.systemTask ? '系统随机' : item.reportType === 1 ? '位置汇报' : '语音汇报',
                color: '#409EFF',
              }
            })
            this.totalPage = res.data.total
            this.drawer = true
            return
          }
          this.activities = []
          this.totalPage = 0
        })
      },
      showDetail(activity){
        this.report = activity
        this.centerDialogVisible = true
      },
      handleCurrentChange(e){
        this.getList(e)
      },
    }
  };
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 15px;
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>

<template>
  <el-drawer
    title="随机抽查记录"
    :visible.sync="drawer">
    <div style="height: calc(100vh - 115px);overflow: auto;">
      <el-timeline :reverse="reverse">
        <transition-group name="el-fade-in">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="activity.reportRecordId"
            :timestamp="activity.createTime"
            :color="activity.color">
            <el-card>
              <el-tag :type="getColor(activity.reportText)">{{ activity.reportText }}</el-tag>
              <p>
                抽查时间：{{ activity.createTime }}
              </p>
              <p>
                报告时间：{{ activity.reportTime }}
              </p>
              <p>
                <el-button type="text" v-if="activity.reportTime != '未报告'" @click="showDetail(activity)">查看详情</el-button>
              </p>
            </el-card>
          </el-timeline-item>
        </transition-group>
      </el-timeline>
    </div>
    <div style="text-align: center;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="5"
        layout="total, prev, pager, next"
        :total="totalPage">
      </el-pagination>
    </div>
    <el-dialog
      title="随机抽查报告详情"
      :visible.sync="centerDialogVisible"
      width="35%"
      append-to-body
      center>
      <el-row v-if="isAudio">
        <el-col :span="4">报告时间：</el-col>
        <el-col :span="20">
          {{ report.reportTime }}
        </el-col>
      </el-row>
      <el-row v-if="isAudio">
        <el-col :span="4">语音内容：</el-col>
        <el-col :span="20">{{ report.transcript }}</el-col>
      </el-row>
      <el-row v-if="isAudio">
        <el-col :span="4">正文录音：</el-col>
        <el-col :span="20">
          <audio :src="report.filePath" controls>
            您的浏览器不支持 audio 标签。
          </audio>
        </el-col>
      </el-row>
      <el-row v-if="!isAudio">
        <el-col :span="4">照片：</el-col>
        <el-col :span="20">
          <el-image :src="report.filePath" style="width: 150px;height: 150px;"></el-image>
        </el-col>
      </el-row>
      <el-row v-if="!isAudio">
        <el-col :span="4">报告位置：</el-col>
        <el-col :span="20">{{ report.location }}</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </el-drawer>
</template>
<script>
  import { findRecognitionRecord } from '@/api/user'
  import tablemix from '@/utils/tablemix'
  export default {
    name:'warninginfo',
    data() {
      return {
        isLoading:false,
        userId:'',
        drawer:false,
        reverse: false,
        activities: [],
        currentPage:1,
        totalPage:0,
        centerDialogVisible:false,
      };
    },
    mixins:[tablemix],
    mounted(){

    },
    methods: {
      show(userId){
        this.userId = userId
        this.currentPage = 1
        this.getList()
      },
      getColor(type){
        const color = new Map([
          [1,'success'],
          [2,'info'],
          ['人脸验证通过','success'],
          ['人脸验证不通过','warning']
        ])
        return color.get(type)
      },
      getList(pageNumber = 1){
        const data = {
          userId : this.userId,
          pageNumber : pageNumber,
          pageSize : 5
        }
        findRecognitionRecord(data).then(res => {
          if (res.data.state == 100){
            this.activities = res.data.list.map(item => {
              return {
                ...item,
                operateText: item.operateType === 1 ? '登录人脸识别' : '报告人脸识别',
                createTime: item.createDate ? this.exChange(item.createDate.time) : '',
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
    title="人脸识别记录(登录/报告操作记录)"
    :visible.sync="drawer">
    <div style="height: calc(100vh - 115px);overflow: auto;">
      <el-timeline :reverse="reverse">
        <transition-group name="el-fade-in">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="activity.recordId"
            :timestamp="activity.createTime"
            :color="activity.color">
            <el-card>
              <p>
                类型：
                <el-tag :type="getColor(activity.operateType)">{{ activity.operateText }}</el-tag>
              </p>
              <p>
                结果：
                <el-tag :type="getColor(activity.result)">{{ activity.result }}</el-tag>
              </p>
              <p>
                照片：
                <el-image :src="activity.recordPicPath"></el-image>
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
  </el-drawer>
</template>
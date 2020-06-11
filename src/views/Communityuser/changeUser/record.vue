<script>
  import { findRecord } from '@/api/user'
  export default {
    name:'record',
    data() {
      return {
        userId:'',
        drawer:false,
        reverse: false,
        activities: [],
        currentPage:1,
        totalPage:0,
      };
    },
    mounted(){

    },
    methods: {
      show(userId){
        this.userId = userId
        this.drawer = true
        this.getList()
      },
      getList(pageNumber = 1){
        const data = {
          userId:this.userId,
          pageNumber:pageNumber,
          pageSize:5
        }
        findRecord(data).then(res => {
          if (res.data.state == 100){
            this.activities = res.data.list.map(item => {
              return {
                ...item,
                abnormal:item.abnormal ? '是' : '否',
                color: '#409EFF',
              }
            })
            this.totalPage = res.data.total
            return
          }
          this.activities = []
          this.totalPage = 0
        })
      },
      handleCurrentChange(e){
        this.getList(e)
      },
    }
  };
</script>

<style lang="scss" scoped>

</style>

<template>
  <el-drawer
    title="报告记录"
    :visible.sync="drawer">
    <div style="height: calc(100vh - 115px);overflow: auto;">
      <el-timeline :reverse="reverse">
        <transition-group name="el-fade-in">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="activity.date"
            :timestamp="activity.date"
            :color="activity.color">
            <el-card>
              <h4>姓名：{{ activity.name }}</h4>
              <el-image :src="activity.picPath"></el-image>
              <p>当日打卡次数：{{ activity.clockTimes }}</p>
              <p>当日需打卡次数：{{ activity.frequence }}</p>
              <p>是否异常：{{ activity.abnormal }}</p>
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
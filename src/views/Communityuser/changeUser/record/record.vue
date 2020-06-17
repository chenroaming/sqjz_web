<script>
  import { findRecord } from '@/api/user'
  import detail from './detail.vue'
  export default {
    name:'record',
    components:{
      detail
    },
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
                abnormalText:item.abnormal ? '未报告' : '已报告',
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
        this.$refs.detail.show(activity)
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
              <p>当日打卡次数/当日需打卡次数：{{ activity.clockTimes }}/{{ activity.frequence }}</p>
              <p>
                <span>是否报告：
                  <el-tag :type="activity.abnormalText === '已报告' ? 'success' : 'warning'">
                    {{ activity.abnormalText }}
                  </el-tag>
                </span>
                <el-button v-if="!activity.abnormal" type="text" @click="showDetail(activity)">查看记录详情</el-button>
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
    <detail ref="detail"></detail>
  </el-drawer>
</template>
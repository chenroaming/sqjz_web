<script>
import { findEvaluationInfo } from '@/api/educationInfo'
import tablemix from '@/utils/tablemix'
export default {
  name: 'EvaluationInfo',
  mixins: [tablemix],
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: false,
      drawer: false,
      reverse: false,
      activities: [],
      currentPage: 1,
      totalPage: 0,
      centerDialogVisible: false,
      type: ['宽管', '普管', '严管']
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.currentPage = 1
      this.getList()
    },
    getColor(type) {
      const color = new Map([
        [1, 'success'],
        [2, 'info'],
        [3, 'warning']
      ])
      return color.get(type)
    },
    getList(pageNumber = 1) {
      const data = {
        userId: this.userId,
        pageNumber: pageNumber,
        pageSize: 5
      }
      findEvaluationInfo(data).then(({ data: { state, list, total }}) => {
        this.$emit('update:done', '')
        if (state == 100) {
          this.activities = list.map(item => {
            return {
              ...item,
              isComplete: item.complete ? '是' : '否',
              typeText: this.type[item.userType - 1],
              createTime: item.createDate ? this.exChange(item.createDate.time) : '',
              color: '#409EFF'
            }
          })
          this.totalPage = total
          this.drawer = true
          return
        }
        this.activities = []
        this.totalPage = 0
      })
    },
    handleCurrentChange(e) {
      this.getList(e)
    }
  }
}
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
    :visible.sync="drawer"
    title="心理测评">
    <div style="height: calc(100vh - 115px);overflow: auto;">
      <el-timeline :reverse="reverse">
        <transition-group name="el-fade-in">
          <el-timeline-item
            v-for="activity in activities"
            :key="activity.evaluationId"
            :timestamp="activity.createTime"
            :color="activity.color">
            <el-card>
              <p>
                发起人：
                <span>{{ activity.adminName }}</span>
              </p>
              <p>
                是否完成：
                <el-tag :type="activity.complete ? 'success':'warning'">{{ activity.isComplete }}</el-tag>
              </p>
              <p v-if="activity.complete">
                综合得分：
                <span>{{ activity.synthesisScore }}</span>
              </p>
              <p v-if="activity.complete">
                评估结果：
                <el-tag :type="getColor(activity.userType)">{{ activity.typeText }}</el-tag>
              </p>
            </el-card>
          </el-timeline-item>
        </transition-group>
      </el-timeline>
    </div>
    <div style="text-align: center;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="5"
        :total="totalPage"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>
  </el-drawer>
</template>

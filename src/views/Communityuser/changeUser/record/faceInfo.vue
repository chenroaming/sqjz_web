<script>
import { findRecognitionRecord, findRecognitionRecordAdmin } from '@/api/user'
import tablemix from '@/utils/tablemix'
export default {
  name: 'Warninginfo',
  mixins: [tablemix],
  props: {
    userId: {
      type: String,
      default: ''
    },
    type: {
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
      adminId: ''
    }
  },
  methods: {
    show() {
      this.$nextTick(() => {
        this.currentPage = 1
        this.getList()
      })
    },
    getColor(type) {
      const color = new Map([
        [1, 'success'],
        [2, 'info'],
        ['人脸验证通过', 'success'],
        ['人脸验证不通过', 'warning']
      ])
      return color.get(type)
    },
    getList(pageNumber = 1) {
      const params = {
        pageNumber: pageNumber,
        pageSize: 5
      }
      this.type === 'admin' && (params.adminId = this.userId) && findRecognitionRecordAdmin(params).then(({ data: { state, list, total }}) => {
        this.refreshList(state, list, total)
      }) // type为admin则查询admin接口的人脸记录
      this.type === 'user' && (params.userId = this.userId) && findRecognitionRecord(params).then(({ data: { state, list, total }}) => {
        this.refreshList(state, list, total)
      }) // type为user则查询user接口的人脸记录
    },
    refreshList(state, list, total) {
      this.$emit('update:done', '')
      if (state === '100') {
        this.activities = list.map(item => {
          return {
            ...item,
            operateText: item.operateType === 1 ? '登录人脸识别' : '报告人脸识别',
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
    },
    handleCurrentChange(e) {
      this.getList(e, this.userId, this.type)
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
    title="人脸识别记录(登录/报告操作记录)">
    <div style="height: calc(100vh - 115px);overflow: auto;">
      <el-timeline :reverse="reverse">
        <transition-group name="el-fade-in">
          <el-timeline-item
            v-for="activity in activities"
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
                <el-image :src="activity.recordPicPath"/>
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

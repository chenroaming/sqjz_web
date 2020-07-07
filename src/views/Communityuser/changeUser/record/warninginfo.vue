<script>
import { find, dispose } from '@/api/warningInfo'
import tablemix from '@/utils/tablemix'
import disposevue from '@/components/warningInfo/dispose'
export default {
  name: 'Warninginfo',
  components: { disposevue },
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
      nowPage: 1,
      drawer: false,
      reverse: false,
      activities: [],
      currentPage: 1,
      totalPage: 0,
      warningType: ['失联', '越界', '未归', '聚集', '未报告', '未移动', '入侵预警'],
      report: {
        reason: '',
        result: '',
        warningId: ''
      }
    }
  },
  computed: {
    isAudio() {
      return this.report.reportType === 2
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
        [1, 'warning'],
        [2, 'warning'],
        [3, 'info'],
        [4, 'danger'],
        [5, 'info'],
        [6, 'success'],
        [7, 'danger']
      ])
      return color.get(type)
    },
    getList(pageNumber = 1) {
      find('', '', this.userId, pageNumber).then(({ data: { state, list, total }}) => {
        this.$emit('update:done', '')
        if (state == 100) {
          this.activities = list.map(item => {
            return {
              ...item,
              warningText: this.warningType[item.warningType - 1],
              warningTime: item.warningDate ? this.exChange(item.warningDate.time) : '',
              missingTime: item.missingDate ? this.exChange(item.missingDate.time) : '',
              recoveryTime: item.recoveryDate ? this.exChange(item.recoveryDate.time) : '',
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
    showDetail(activity) {
      this.report = activity
      this.$refs.disposevue.show()
    },
    handleCurrentChange(e) {
      this.nowPage = e
      this.getList(e)
    },
    done() {
      this.getList(this.nowPage)
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
    title="违规预警记录">
    <div style="height: calc(100vh - 115px);overflow: auto;">
      <el-timeline :reverse="reverse">
        <transition-group name="el-fade-in">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="activity.warningId"
            :timestamp="activity.warningTime"
            :color="activity.color">
            <el-card>
              <el-tag :type="getColor(activity.warningType)">{{ activity.warningText }}</el-tag>
              <p>
                GPS定位地址：{{ activity.location }}
              </p>
              <p v-if="activity.warningType == 1">
                失联时间：{{ activity.missingTime }}
              </p>
              <p v-if="activity.warningType == 1">
                复联时间：{{ activity.recoveryTime }}
              </p>
              <p v-if="activity.warningType == 4">
                聚集人数：{{ activity.userInfos.length }}
              </p>
              <p v-if="activity.warningType == 4">
                聚集人员：
                <el-tag v-for="item in activity.userInfos" :key="item.picPath" type="warning" style="margin-right: 5px;">{{ item.name }}</el-tag>
              </p>
              <p>
                <el-button v-if="!activity.disposed" type="text" @click="showDetail(activity)">点击处置</el-button>
              </p>
            </el-card>
          </el-timeline-item>
        </transition-group>
      </el-timeline>
    </div>
    <div style="text-align: center;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="10"
        :total="totalPage"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>
    <disposevue ref="disposevue" :warning-id="report.warningId" @done="done"/>
  </el-drawer>
</template>

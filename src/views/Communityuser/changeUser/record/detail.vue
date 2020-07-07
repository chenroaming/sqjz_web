<script>
import { findRecordDetail } from '@/api/user'
import tablemix from '@/utils/tablemix'
export default {
  name: 'Detail',
  mixins: [tablemix],
  data() {
    return {
      centerDialogVisible: false,
      list: []
    }
  },
  mounted() {

  },
  methods: {
    show({ userId, date }) {
      const data = {
        userId: userId,
        date: date
      }
      findRecordDetail(data).then(({ data: { state, list }}) => {
        if (state == 100) {
          this.list = list.map(item => {
            return {
              ...item,
              clockTime: item.clockDate ? this.exChange(item.clockDate.time) : ''
            }
          })
          this.centerDialogVisible = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .el-row {
    margin-bottom: 30px;
    font-size: 18px;
    font-weight: bold;
  }
</style>

<template>
  <el-dialog
    :visible.sync="centerDialogVisible"
    title="报告记录详情"
    width="35%"
    append-to-body
    center>
    <el-row v-for="item in list" :gutter="20" :key="item.detailId">
      <el-col :span="24" style="text-align: center;margin-bottom: 30px;">
        <el-image :src="item.picPath"/>
      </el-col>
      <el-col :span="24">
        <el-row>
          打卡时间：{{ item.clockTime }}
        </el-row>
        <!-- <el-row>
          开始时间：{{ item.startTime }}
        </el-row>
        <el-row>
          结束时间：{{ item.endTime }}
        </el-row>
        <el-row>
          经度：{{ item.longitude }}
        </el-row>
        <el-row>
          经度：{{ item.latitude }}
        </el-row> -->
        <el-row>
          位置信息：{{ item.location }}
        </el-row>
        <el-row>
          是否偏离：
          <el-tag :type="item.deviate ? 'warning' : 'success'">
            {{ item.deviate ? '是' : '否' }}
          </el-tag>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>

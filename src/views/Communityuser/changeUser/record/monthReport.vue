
<template>
  <el-drawer
    :visible.sync="drawer"
    title="月度报告">
    <el-row :gutter="20" style="width: 99%;margin: 0 auto;">
      <el-col :span="8">
        <el-select v-model="years" placeholder="请选择">
          <el-option
            v-for="item in yearsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select v-model="months" placeholder="请选择">
          <el-option
            v-for="item in monthsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" @click="getList">搜索</el-button>
      </el-col>
    </el-row>
    <el-scrollbar class="scrollbar">
      <el-card class="box-card2">
        <div slot="header">
          <span>报告次数统计</span>
        </div>
        <p>
          已完成天数：
          <el-tag type="success">
            {{ clockCount.complete }}
          </el-tag>
        </p>
        <p>
          未完成天数：
          <el-tag type="warning">
            {{ clockCount.uncompleted }}
          </el-tag>
        </p>
      </el-card>
      <histogram ref="histogram" :chart-data="warningTypeCount" chart-title="预警类型统计"/>
    </el-scrollbar>
  </el-drawer>
</template>

<script>
import dateMixins from './dateMixins'
import { findMonthlyReport } from '@/api/user'
import histogram from '@/components/charts/histogram2'
export default {
  name: 'MouthReport',
  components: {
    histogram
  },
  mixins: [dateMixins],
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      drawer: false,
      clockCount: {},
      warningTypeCount: []
    }
  },
  mounted() {
    this.initDate()
  },
  methods: {
    getList() {
      const data = {
        userId: this.userId,
        date: `${this.years}-${this.months}`
      }
      findMonthlyReport(data).then(({ data: { state, clockCount, warningTypeCount }}) => {
        // 当state为100时顺序执行后续操作
        state === '100' && (this.clockCount = clockCount) && (this.warningTypeCount = warningTypeCount) && (this.drawer = true)
        this.$nextTick(() => {
          this.$emit('update:done', '')
          this.$refs.histogram.chartInit()
        })
      })
    },
    show() {
      this.getList()
    }
  }
}
</script>

<style lang="scss">
  .box-card2 {
    margin: 0 auto;
    width: 95%;
    margin-top: 10px;
  }
  .chartBox{
    width: 100%;
    height: 300px;
  }
</style>

<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    size="35%"
    title="汇报记录">
    <el-button-group style="margin:3%;">
      <el-button
        v-for="item in buttonGroup"
        :key="item.index"
        :class="params.reported === item.index ? 'isSelect' : ''"
        type="primary"
        size="mini"
        plain
        @click="changeSelect(item.index)">{{ item.label }}</el-button>
    </el-button-group>
    <transition-group name="breadcrumb">
      <el-table
        v-loading="isLoading"
        ref="multipleTable"
        :data="tableData"
        :key="params.reportTaskId"
        tooltip-effect="light"
        style="width: 100%"
        height="calc( 100vh - 220px )">
        <el-table-column
          prop="name"
          label="姓名"
          align="center"/>
        <el-table-column
          prop="reportTime"
          label="汇报时间"
          align="center"/>
        <el-table-column
          prop="location"
          label="位置"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.location | isEmpty }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.reported === '1'"
          label="详情"
          align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </transition-group>
    <div style="text-align: center;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="10"
        :total="totalPage"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>
    <showFile ref="showFile"/>
  </el-drawer>
</template>

<script>
import tablemix from '@/utils/tablemix'
import showFile from '@/components/userFile/showFile'
import { findRecord } from '@/api/reportTask'
export default {
  name: 'Detail',
  components: {
    showFile
  },
  filters: {
    isEmpty(value) {
      return !value ? '暂无' : value
    }
  },
  mixins: [tablemix], // 混入文件
  props: {
    reportTaskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: false,
      drawer: false,
      direction: 'rtl',
      currentPage: 1,
      buttonGroup: [
        { index: '0', label: `未汇报`, total: 0 },
        { index: '1', label: `已汇报`, total: 0 }
      ],
      tableData: [],
      totalPage: 0,
      params: {
        reportTaskId: this.reportTaskId,
        pageSize: 10,
        pageNumber: this.currentPage,
        reported: '0'
      }
    }
  },
  computed: {

  },
  watch: {
    drawer(cur, old) {
      !cur &&
      (this.currentPage = 1) &&
      (this.params.reported = '0') &&
      (this.params.pageNumber = 1)
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.$nextTick(() => {
        this.getList()
      })
    },
    getList() {
      this.params.reportTaskId = this.reportTaskId
      this.isLoading = true
      findRecord(this.params).then(({ data: { state, list, total }}) => {
        this.$emit('update:isLoading', false)
        this.tableData = state === '100' ? list.map(item => {
          return {
            ...item,
            reportTime: item.reportDate && item.reportDate.time
              ? this.exChange(item.reportDate.time) : '暂无'
          }
        }) : []
        this.totalPage = state === '100' ? total : 0
        this.drawer = true
      })
        .finally(() => { this.isLoading = false })
    },
    changeSelect(index) {
      if (this.params.reported === index) return false
      this.params.pageNumber = 1
      this.currentPage = 1
      this.params.reported = index
      this.getList()
    },
    handleCurrentChange() {
      this.params.pageNumber = this.currentPage
      this.getList()
    },
    showDetail({ reportType, filePath }) {
      const file = {
        name: filePath,
        path: filePath
      }
      this.$refs.showFile.showEvidence(file)
    }
  }
}
</script>

<style scoped lang = "scss">
  $borderColor:#409EFF;
  .isSelect {
    background: $borderColor;
    border-color: $borderColor;
    color: #FFF;
  }
</style>

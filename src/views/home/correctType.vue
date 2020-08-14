<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    :title="title">
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
        <el-button type="primary" @click="search">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="light"
      style="width: 100%"
      height="calc( 100vh - 150px )">
      <el-table-column
        prop="picPath"
        label="照片"
        align="center">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.picPath"
            :preview-src-list="[scope.row.picPath]"
            style="width: 150px;height: 150px;"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center"/>
      <el-table-column
        prop="clockId"
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
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

<script>
import countMixin from './countMixins'
import dateMixins from '@/views/Communityuser/changeUser/record/dateMixins'
export default {
  name: 'CorrectType',
  mixins: [countMixin, dateMixins], // 公用数据混入
  props: {
    formTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {
    title() {
      return `矫正人员-${this.formTitle}`
    }
  },
  mounted() {
    this.initDate()
  },
  methods: {
    search() {
      this.searchParams['date'] = `${this.years}-${this.months}`
      this.getList()
    }
  }
}
</script>

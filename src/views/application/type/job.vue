<template>
  <el-table
    v-loading="isLoading"
    :data="getTableData"
    :header-cell-style="rowClass"
    class="tableShadow"
    element-loading-text="数据拼命加载中...."
  >
    <el-table-column prop="picPath" label="照片" align="center">
      <template slot-scope="scope">
        <el-image
          :src="scope.row.picPath"
          style="width: 100px; height: 100px"/>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="姓名" align="center"/>
    <el-table-column prop="applyDate" label="申请时间" align="center"/>
    <el-table-column prop="auditText" label="审核状态" align="center">
      <template slot-scope="scope">
        <el-tag :type="getColor(scope.row.auditState)">
          {{ scope.row.auditText }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="auditAdmin" label="审核人" align="center"/>
    <el-table-column prop="position" label="职位" align="center"/>
    <!-- <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
    <el-table-column prop="expectedSalary" label="期望薪资" align="center"></el-table-column>

    <el-table-column prop="speciality" label="特长" align="center"></el-table-column> -->
    <el-table-column label="操作" width="300" align="center">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="proofPicPaths(scope.row.proofPicPaths)">查看照片集</el-button>
        <el-button v-if="scope.row.isShow" type="warning" size="mini" @click="showAudit(scope.row.applyId)">审核</el-button>
        <el-button type="info" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
      </template>
    </el-table-column>
    <audit ref="audit" v-bind="$attrs" :audit-obj="auditObj" v-on="$listeners"/>
    <jobD ref="jobD" :row="row"/>
  </el-table>
</template>

<script>
import tablemix from '@/utils/tablemix'
import showDetail from '@/components/interviewRecord/showDetail.vue'
import audit from '@/components/interviewRecord/audit.vue'
import authmix from '@/utils/authmix'// 引入权限校验
import jobD from './details/jobD'
export default {
  name: 'Job',
  components: {
    showDetail,
    audit,
    jobD
  },
  mixins: [tablemix, authmix],
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      auditObj: {
        applyType: 6,
        applyId: ''
      },
      row: {}
    }
  },
  computed: {
    getTableData() {
      const newTable = this.tableData.map(item => {
        return {
          ...item,
          applyDate: this.exChange(item.applyDate.time),
          auditText: this.auditState[item.auditState],
          isShow: !!((item.auditState == 0 && this.checkPermission(['application:audit'])))
        }
      })
      return newTable
    }
  },
  methods: {
    showDetail(row) {
      this.row = row
      this.$refs.exemptionD.showDetail()
    }
  }
}
</script>

<template>
  <el-table
    v-loading="isLoading"
    :data="getTableData"
    :header-cell-style="rowClass"
    class="tableShadow"
    element-loading-text="数据拼命加载中...."
  >
    <el-table-column :width="columnWidth" prop="picPath" label="照片" align="center">
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
    <el-table-column prop="reason" label="外出理由" align="center"/>
    <el-table-column prop="auditAdmin" label="审核人" align="center"/>
    <!-- <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
    <el-table-column prop="address" label="外出地址" align="center"></el-table-column> -->
    <!-- <el-table-column prop="outDate" :width="columnWidth" label="外出时间" align="center"></el-table-column>
    <el-table-column prop="returnDate" :width="columnWidth" label="返回时间" align="center"></el-table-column>
    <el-table-column prop="reason" :width="columnWidth" label="外出理由" align="center"></el-table-column>
    <el-table-column prop="auditState" :width="columnWidth" label="审核状态" align="center">
      <template slot-scope="scope">
        <el-tag :type="getColor(scope.row.auditState)">
          {{auditState[scope.row.auditState]}}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="auditAdmin" :width="columnWidth" label="审核人" align="center"></el-table-column> -->
    <el-table-column :width="350" label="操作" fixed="right" align="center">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="proofPicPaths(scope.row.proofPicPaths)">查看照片集</el-button>
        <el-button v-if="scope.row.isShow" type="warning" size="mini" @click="showAudit(scope.row.applyId)">审核</el-button>
        <el-button type="info" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
      </template>
    </el-table-column>
    <audit ref="audit" v-bind="$attrs" :audit-obj="auditObj" v-on="$listeners"/>
    <showDetail ref="showDetail" :interview-pic-paths="picArr"/>
    <outgoingD ref="outgoingD" :row="row"/>
  </el-table>
</template>

<script>
import tablemix from '@/utils/tablemix'
import showDetail from '@/components/interviewRecord/showDetail.vue'
import audit from '@/components/interviewRecord/audit.vue'
import outgoingD from './details/outgoingD.vue'
import authmix from '@/utils/authmix'// 引入权限校验
export default {
  name: 'Outgoing',
  components: {
    showDetail,
    audit,
    outgoingD
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
        applyType: 2,
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
          outDate: item.outDate ? this.exChange(item.outDate.time) : '',
          returnDate: item.returnDate ? this.exChange(item.returnDate.time) : '',
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
      this.$refs.outgoingD.showDetail()
    }
  }
}
</script>

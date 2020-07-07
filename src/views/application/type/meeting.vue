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
    <el-table-column prop="reason" label="会客理由" align="center"/>
    <el-table-column prop="auditText" label="审核状态" align="center">
      <template slot-scope="scope">
        <el-tag :type="getColor(scope.row.auditState)">
          {{ scope.row.auditText }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column :width="columnWidth" prop="auditAdmin" label="审核人" align="center"/>
    <!-- <el-table-column prop="startDate" :width="columnWidth" label="开始时间" align="center"></el-table-column>
    <el-table-column prop="endDate" :width="columnWidth" label="结束时间" align="center"></el-table-column>
    <el-table-column prop="phone" :width="columnWidth" label="手机号" align="center"></el-table-column> -->
    <el-table-column :width="columnWidth" label="操作" align="center">
      <template slot-scope="scope">
        <el-button v-if="checkPermission['application:audit']" type="warning" size="mini" @click="showAudit(scope.row.applyId)">审核</el-button>
        <el-button type="info" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
      </template>
    </el-table-column>
    <meetingD ref="meetingD" :row="row"/>
    <!-- 通过$attrs和$listeners架起祖孙组件沟通桥梁 -->
    <audit ref="audit" v-bind="$attrs" :audit-obj="auditObj" v-on="$listeners"/>
  </el-table>
</template>

<script>
import tablemix from '@/utils/tablemix.js'
import audit from '@/components/interviewRecord/audit.vue'
import authmix from '@/utils/authmix'// 引入权限校验
import meetingD from './details/meetingD'
export default {
  name: 'Meeting',
  components: {
    audit, meetingD
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
        applyType: 1,
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
          startDate: item.startDate ? this.exChange(item.startDate.time) : '',
          endDate: item.endDate ? this.exChange(item.endDate.time) : '',
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
      this.$refs.meetingD.showDetail()
    }
  }
}
</script>

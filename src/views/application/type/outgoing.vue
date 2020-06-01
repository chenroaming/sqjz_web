<template>
  <el-table
    v-loading="isLoading"
    :data="getTableData"
    class="attendanceTable"
    element-loading-text="数据拼命加载中...."
    height="250px"
    style="width: 100%"
  >
    <el-table-column prop="name" :width="columnWidth" label="姓名" align="center"></el-table-column> 
    <el-table-column prop="applyDate" :width="columnWidth" label="申请时间" align="center"></el-table-column>
    <el-table-column prop="phone" :width="columnWidth" label="手机号" align="center"></el-table-column>
    <el-table-column prop="address" :width="columnWidth" label="外出地址" align="center"></el-table-column>
    <el-table-column prop="outDate" :width="columnWidth" label="外出时间" align="center"></el-table-column>
    <el-table-column prop="returnDate" :width="columnWidth" label="返回时间" align="center"></el-table-column>
    <el-table-column prop="reason" :width="columnWidth" label="外出理由" align="center"></el-table-column>
    <el-table-column prop="picPath" :width="columnWidth" label="照片" align="center">
      <template slot-scope="scope">
        <el-image
          style="width: 100px; height: 100px"
          :src="scope.row.picPath">
        </el-image>
      </template>
    </el-table-column>
    <el-table-column prop="auditState" :width="columnWidth" label="审核状态" align="center">
      <template slot-scope="scope">
        <el-tag :type="getColor(scope.row.auditState)">
          {{auditState[scope.row.auditState]}}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="auditAdmin" :width="columnWidth" label="审核人" align="center"></el-table-column>
    <el-table-column label="操作" :width="columnWidth" fixed="right" align="center">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="proofPicPaths(scope.row.proofPicPaths)">查看照片集</el-button>
        <el-button v-if="scope.row.isShow" type="warning" size="mini" @click="showAudit(scope.row.applyId)">审核</el-button>
      </template>
    </el-table-column>
    <audit v-bind="$attrs" v-on="$listeners" ref="audit" :auditObj="auditObj"></audit>
    <showDetail ref="showDetail" :interviewPicPaths="picArr"></showDetail>
  </el-table>
</template>

<script>
  import tablemix from '@/utils/tablemix'
  import showDetail from '@/components/interviewRecord/showDetail.vue'
  import audit from '@/components/interviewRecord/audit.vue'
  import authmix from "@/utils/authmix";//引入权限校验
  export default {
    name:'outgoing',
    props:{
      tableData:{
        type:Array,
        default:[]
      },
      isLoading:{
        type:Boolean,
        default:false
      }
    },
    components:{
      showDetail,
      audit
    },
    data() {
      return {
        auditObj:{
          applyType:2,
          applyId:''
        },
      }
    },
    mixins: [tablemix,authmix],
    computed:{
      getTableData(){
        const newTable = this.tableData.map(item => {
          return {
            ...item,
            applyDate:this.exChange(item.applyDate.time),
            outDate:item.outDate ?  this.exChange(item.outDate.time) : '',
            returnDate:item.returnDate ? this.exChange(item.returnDate.time) : '',
            isShow:(item.auditState == 0 && this.checkPermission(['application:audit'])) ? true : false
          }
        })
        return newTable;
      }
    },
    methods: {
      
    }
  }
</script>
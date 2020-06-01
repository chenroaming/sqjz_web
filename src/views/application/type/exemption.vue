<template>
  <el-table
    v-loading="isLoading"
    :data="getTableData"
    class="attendanceTable"
    element-loading-text="数据拼命加载中...."
    height="250px"
    style="width: 100%"
  >
    <el-table-column prop="name" label="姓名" align="center"></el-table-column> 
    <el-table-column prop="applyDate" :width="columnWidth" label="申请时间" align="center"></el-table-column>
    <el-table-column prop="phone" :width="columnWidth" label="手机号" align="center"></el-table-column>
    <el-table-column prop="timeLimit" :width="columnWidth" label="免除期限" align="center"></el-table-column>
    <el-table-column prop="reason" :width="columnWidth" label="免除理由" align="center"></el-table-column>
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
    name:'exemption',
    props:{
      tableData:{
        type:Array,
        default:[]
      },
      isLoading:{
        type:Boolean,
        default:false
      },
      applyType:Number
    },
    data() {
      return {
        auditObj:{
          applyType:this.applyType,
          applyId:''
        },
      }
    },
    components:{
      showDetail,
      audit
    },
    mixins: [tablemix,authmix],
    computed:{
      getTableData(){
        const newTable = this.tableData.map(item => {
          return {
            ...item,
            applyDate:this.exChange(item.applyDate.time),
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
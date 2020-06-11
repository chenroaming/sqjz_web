<template>
  <el-table
    v-loading="isLoading"
    :data="getTableData"
    class="tableShadow"
    :header-cell-style="rowClass"
    element-loading-text="数据拼命加载中...."
  >
    <el-table-column prop="name" label="姓名" :width="columnWidth" align="center"></el-table-column> 
    <el-table-column prop="applyDate" :width="columnWidth" label="申请时间" align="center"></el-table-column>
    <el-table-column prop="reason" :width="columnWidth" label="会客理由" align="center"></el-table-column>
    <el-table-column prop="startDate" :width="columnWidth" label="开始时间" align="center"></el-table-column>
    <el-table-column prop="endDate" :width="columnWidth" label="结束时间" align="center"></el-table-column>
    <el-table-column prop="phone" :width="columnWidth" label="手机号" align="center"></el-table-column>
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
    <el-table-column prop="auditAdmin" label="审核人" :width="columnWidth" align="center"></el-table-column>
    <el-table-column label="操作" :width="columnWidth" fixed="right" align="center">
      <template slot-scope="scope">
        <el-button v-if="scope.row.isShow" type="warning" size="mini" @click="showAudit(scope.row.applyId)">审核</el-button>
      </template>
    </el-table-column>
    <!-- 通过$attrs和$listeners架起祖孙组件沟通桥梁 -->
    <audit v-bind="$attrs" v-on="$listeners" ref="audit" :auditObj="auditObj"></audit>
  </el-table>
</template>

<script>
  import tablemix from '@/utils/tablemix.js'
  import audit from '@/components/interviewRecord/audit.vue'
  import authmix from "@/utils/authmix";//引入权限校验
  export default {
    name:'meeting',
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
    data() {
      return {
        auditObj:{
          applyType:1,
          applyId:''
        },
      }
    },
    mixins: [tablemix,authmix],
    components:{
      audit
    },
    computed:{
      getTableData(){
        const newTable = this.tableData.map(item => {
          return {
            ...item,
            applyDate:this.exChange(item.applyDate.time),
            startDate:item.startDate ? this.exChange(item.startDate.time) : '',
            endDate:item.endDate ? this.exChange(item.endDate.time) : '',
            isShow:(item.auditState == 0 && this.checkPermission(['application:audit'])) ? true : false
          }
        })
        return newTable;
      },
    },
    methods: {
      
    }
  }
</script>
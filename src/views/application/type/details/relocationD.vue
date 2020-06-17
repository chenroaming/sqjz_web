<script>
  export default {
    name:'outgoingD',
    props:{
      row:{
        type:Object,
        default:() => {}
      }
    },
    data() {
      return {
        centerDialogVisible:false,
      }
    },
    methods: {
      showDetail(){
        this.centerDialogVisible = true
      }
    },
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 8px;
  }
</style>

<template>
  <el-dialog
    title="查看详情"
    :visible.sync="centerDialogVisible"
    width="35%"
    append-to-body
    center>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-image :src="row.picPath" style="width: 180px;height: 200px;"></el-image>
      </el-col>
      <el-col :span="14">
        <el-row>
          <el-col :span="8">
            姓名：
          </el-col>
          {{row.name}}
        </el-row>
        <el-row>
          <el-col :span="8">
            申请时间：
          </el-col>
          {{row.applyDate}}
        </el-row>
        <el-row>
          <el-col :span="8">
            迁居地地址：
          </el-col>
          {{row.relocateAddress}}
        </el-row>
        <el-row>
          <el-col :span="8">
            迁居地小区：
          </el-col>
          {{row.relocateLivingArea}}
        </el-row>
        <el-row>
          <el-col :span="8">
            变更理由：
          </el-col>
          {{row.reason}}
        </el-row>
        <el-row>
          <el-col :span="8">
            审核状态：
          </el-col>
          {{row.auditText}}
        </el-row>
        <el-row>
          <el-col :span="8">
            审核人：
          </el-col>
          {{row.auditAdmin}}
        </el-row>
        <el-row>
          <el-col :span="8">
            审核理由：
          </el-col>
          {{row.auditReason}}
        </el-row>
        <el-row>
          <el-col :span="8">
            电话号码：
          </el-col>
          {{row.phone}}
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
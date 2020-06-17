<script>
  export default {
    name:'jobD',
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
      <el-col :span="12">
        <el-image :src="row.picPath" style="width: 180px;height: 200px;"></el-image>
      </el-col>
      <el-col :span="12">
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
            职位：
          </el-col>
          {{row.position}}
        </el-row>
        <el-row>
          <el-col :span="8">
            期望薪资：
          </el-col>
          {{row.expectedSalary}}
        </el-row>
        <el-row>
          <el-col :span="8">
            特长：
          </el-col>
          {{row.speciality}}
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
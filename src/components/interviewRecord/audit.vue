<template>
  <el-dialog
    title="事项审核"
    :visible.sync="dialogVisible"
    center
    width="30%"
    append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item prop="auditState" label="审核状态">
        <el-radio-group v-model="form.auditState">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="2">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="auditReason" label="审核理由">
        <el-input placeholder="请输入审核理由" v-model="form.auditReason"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" size="mini" @click="submit" :loading="isLoding">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { audit } from '@/api/application'
  export default {
    name: "audit",
    props:{
      auditObj:Object
    },
    data() {
      return {
        isLoding:false,
        dialogVisible:false,
        form:{
          auditState:'',
          auditReason:''
        },
        rules:{
          auditState:[
            { required: true, message: '请选择审核状态', trigger: 'blur' },
          ],
          auditReason:[
            { required: true, message: '请输入审核理由', trigger: 'blur' },
          ]
        }
      }
    },
    mounted() {

    },
    methods: {
      submit(){
        this.$refs['form'].validate((valid) => {
          if (!valid){
            return false;
          }
          this.isLoding = true;
          const data = {
            applyType:this.auditObj.applyType,
            applyId:this.auditObj.applyId,
            auditState:this.form.auditState,
            auditReason:this.form.auditReason
          }
          audit(data).then(res => {
            this.isLoding = false;
            if(res.data. state == 100){
              this.dialogVisible = false;
              this.$emit('getData')//直接触发祖父组件事件
            }
          })
        })
      },
      show(){
        this.dialogVisible = true;
      },
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
<script>
  import { audit } from '@/api/product.js'
  export default {
    name:'audit',
    props: {
      productId:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        centerDialogVisible:false,
        auditState:null,
        audit:{
          productId:'',
          auditState:null,
          auditReason:''
        },
        rules: {
          auditState: [
            { required: true, message: '请选择审核状态', trigger: 'blur' },
          ],
          auditReason: [
            { required: true, message: '请输入审核理由', trigger: 'blur' },
          ]
        }
      }
    },
    watch:{
      centerDialogVisible(cur,old){
        if (!cur){
          this.$refs['form'].resetFields()
        }
      }
    },
    methods: {
      show(){
        this.centerDialogVisible = true
      },
      submit(){
        this.audit.productId = this.productId
        audit({...this.audit}).then(res => {
          if(res.data.state == 100){
            this.$emit('handleSuccess')
            this.centerDialogVisible = false
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  
</style>

<template>
  <el-dialog
    title="提示"
    :visible.sync="centerDialogVisible"
    width="30%"
    center>
    <el-form ref="form" :model="audit" :rules="rules" label-width="100px">
      <el-form-item label="审核状态" prop="auditState">
        <el-radio-group v-model="audit.auditState">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="2">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核理由" prop="auditReason">
        <el-input v-model="audit.auditReason" placeholder="请输入审核理由"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
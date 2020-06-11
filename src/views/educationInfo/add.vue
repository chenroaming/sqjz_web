<script>
  import { add,updateInfo } from '@/api/educationInfo.js'
  export default {
    components: {
      
    },
    data() {
      return {
        isLoading:false,
        dialogTableVisible: false,
        eduForm:{
          educationId:'',
          educationName:'',
          integral:1,
          description:'',
          file:''
        },
        rules:{
          educationName: [
            { required: true, message: '请输入资料名称', trigger: 'blur' },
          ],
          description: [
            { required: true, message: '请输入描述', trigger: 'blur' },
          ],
        },
        fileList:[],
      }
    },
    mixins: [],//混入文件
    watch:{
      dialogTableVisible(cur,old){
        if (!cur){
          this.$refs['ruleForm'].resetFields()
          this.fileList = []
          this.eduForm.file = ''
        }
      }
    },
    computed:{
      getTitle(){
        return this.eduForm.educationId ? '修改教育资料' : '新增教育资料'
      }
    },
    methods: {
      show({ educationId,educationName,description }){
        this.eduForm.educationId = educationId
        this.eduForm.educationName = educationName
        this.eduForm.description = description
        this.dialogTableVisible = true
      },
      fileChange(file){
        this.eduForm.file = file.raw
      },
      submit(){
        this.$refs['ruleForm'].validate((valid) => {
          if (!valid){
            return this.$message.warning('请确保选项填写完整！')
          }
          this.isLoading = true
          const data = {...this.eduForm}
          const formData = new FormData()
          for (const i in data){
            formData.append(i,data[i])
          }
          if (this.eduForm.educationId){
            formData.delete('integral')//更新时不传integral字段
            !formData.get('file') && formData.delete('file')//无文件时不传file字段，避免后端报错
            updateInfo(formData).then(res => {
              this.isLoading = false
              if (res.data.state == 100){
                this.$emit('success')
                this.dialogTableVisible = false
              }
            })
            return
          }
          this.isLoading = false
          this.eduForm.file ? add(formData).then(res => {
            if (res.data.state == 100){
              this.$emit('success')
              this.dialogTableVisible = false
            }
          }) : this.$message.warning('请选择文件！')
        })
      },
      handleRemove(file){
        this.eduForm.file = ''
      }
    }
  };
</script>

<style lang="scss" scoped>
  
</style>

<template>
  <el-dialog :title="getTitle" width="30%" :visible.sync="dialogTableVisible" :close-on-click-modal="false" center>
    <el-form :model="eduForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="文件名称" prop="educationName">
        <el-input v-model="eduForm.educationName"></el-input>
      </el-form-item>
      <el-form-item label="积分" prop="integral" v-if="!eduForm.educationId">
        <el-input-number v-model="eduForm.integral" label="请输入或选择积分"></el-input-number>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="eduForm.description"></el-input>
      </el-form-item>
      <el-form-item label="文件">
        <el-upload
          class="upload-demo"
          action="#"
          :on-change="fileChange"
          :auto-upload="false"
          :limit="1"
          :on-remove="handleRemove"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { add, updateInfo } from '@/api/educationInfo.js'
export default {
  components: {

  },
  mixins: [],
  data() {
    return {
      isLoading: false,
      dialogTableVisible: false,
      eduForm: {
        educationId: '',
        educationName: '',
        integral: 1,
        description: '',
        file: '',
        documentType: '',
        fileLink: ''
      },
      rules: {
        educationName: [
          { required: true, message: '请输入资料名称', trigger: ['change', 'blur'] }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: ['change', 'blur'] }
        ],
        documentType: [
          { required: true, message: '请选择文件类型', trigger: ['change', 'blur'] }
        ],
        fileLink: [
          { validator: this.fileLinkVaild, trigger: ['change', 'blur'] }
        ],
        file: [
          { validator: this.fileVaild, trigger: ['change', 'blur'] }
        ]
      },
      fileList: [],
      documentType: [{ value: 1, label: '电子书' }, { value: 2, label: '视频' }],
      checkFile: false
    }
  },
  computed: {
    getTitle() {
      return this.eduForm.educationId ? '修改教育资料' : '新增教育资料'
    }
  },
  watch: {
    dialogTableVisible(cur, old) {
      if (!cur) {
        this.$refs['ruleForm'].resetFields()
        this.fileList = []
        this.eduForm.file = ''
      }
    }
  },
  methods: {
    show({ educationId, educationName, description, documentType, fileLink }) {
      this.eduForm = { educationId, educationName, description, file: '', documentType, fileLink }
      this.checkFile = documentType === 2
      this.dialogTableVisible = true
    },
    fileChange(file) {
      this.eduForm.file = file.raw
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.isLoading = true
        const data = { ...this.eduForm }
        const formData = new FormData()
        for (const i in data) {
          formData.append(i, data[i])
        }
        if (this.eduForm.educationId) {
          formData.delete('integral')// 更新时不传integral字段，避免后端报错
          !formData.get('file') && formData.delete('file')// 无文件时不传file字段，避免后端报错
          this.eduForm.documentType === 1 && formData.delete('fileLink') // 文件类型为2时不传文件链接
          updateInfo(formData).then(res => {
            this.isLoading = false
            if (res.data.state === '100') {
              this.$emit('success')
              this.dialogTableVisible = false
            }
          })
          return
        }
        formData.delete('educationId') // 添加新文件时不传educationId,避免后端报错
        this.eduForm.documentType === 2 && formData.delete('file') // 文件为视频时不传文件字段，避免后端报错
        this.eduForm.documentType === 1 && !this.eduForm.file
          ? this.$message.warning('请选择文件！') : add(formData).then(res => {
            this.isLoading = false
            if (res.data.state === '100') {
              this.$emit('success')
              this.dialogTableVisible = false
            }
          })
      })
    },
    handleRemove(file) {
      this.eduForm.file = ''
    },
    fileLinkVaild(rule, value, callback) {
      this.eduForm.documentType === 2 && !value ? callback(new Error('请输入视频链接')) : callback()
    },
    fileVaild(rule, value, callback) {
      // 文件类型
      this.eduForm.documentType === 1 && !value && (!this.eduForm.fileLink || this.checkFile) ? callback(new Error('请上传文件')) : callback()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <el-dialog :title="getTitle" :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="30%" center>
    <el-form ref="ruleForm" :model="eduForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="文件名称" prop="educationName">
        <el-input v-model="eduForm.educationName"/>
      </el-form-item>
      <el-form-item v-if="!eduForm.educationId" label="文件类型" prop="documentType">
        <el-select v-model="eduForm.documentType" placeholder="请选择">
          <el-option
            v-for="item in documentType"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!eduForm.educationId" label="积分" prop="integral">
        <el-input-number v-model="eduForm.integral" label="请输入或选择积分"/>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="eduForm.description"/>
      </el-form-item>
      <el-form-item v-show="eduForm.documentType === 1" prop="file" label="文件">
        <el-upload
          :on-change="fileChange"
          :auto-upload="false"
          :limit="1"
          :on-remove="handleRemove"
          :file-list="fileList"
          class="upload-demo"
          action="#">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item v-show="eduForm.documentType === 2" label="文件链接" prop="fileLink">
        <el-input v-model="eduForm.fileLink"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取 消</el-button>
      <el-button :loading="isLoading" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

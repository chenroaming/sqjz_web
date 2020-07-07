<script>
import { dispose } from '@/api/warningInfo'
export default {
  name: 'Disposevue',
  props: {
    warningId: String,
    default: ''
  },
  data() {
    return {
      dialogVisible: false,
      isLoading: false,
      form: {
        reason: '',
        result: '',
        warningId: ''
      },
      rules: {
        reason: [
          { required: true, message: '请输入处置理由', trigger: ['blur', 'change'] }
        ],
        result: [
          { required: true, message: '请输入处置结果', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  watch: {
    dialogVisible(cur, old) {
      !cur && this.$refs['form'].resetFields()
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return this.$message.warning('请确保选项填写完整！')
        }
        this.isLoading = true
        this.form.warningId = this.warningId
        dispose(this.form).then(res => {
          this.isLoading = false
          if (res.data.state == 100) {
            this.dialogVisible = false
            this.$emit('done')
          }
        })
          .catch(error => {
            console.log(error)
          })
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="预警信息处置"
    append-to-body
    center
    width="30%">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="发生原因" prop="reason">
        <el-input v-model="form.reason" placeholder="请输入发生原因"/>
      </el-form-item>
      <el-form-item label="处置结果" prop="result">
        <el-input v-model="form.result" placeholder="请输入处置结果"/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="isLoading" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

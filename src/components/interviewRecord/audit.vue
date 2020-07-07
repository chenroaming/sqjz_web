<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="事项审核"
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
        <el-input v-model="form.auditReason" placeholder="请输入审核理由"/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button :loading="isLoding" type="primary" size="mini" @click="submit">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { audit } from '@/api/application'
export default {
  name: 'Audit',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    auditObj: Object
  },
  data() {
    return {
      isLoding: false,
      dialogVisible: false,
      form: {
        auditState: '',
        auditReason: ''
      },
      rules: {
        auditState: [
          { required: true, message: '请选择审核状态', trigger: 'blur' }
        ],
        auditReason: [
          { required: true, message: '请输入审核理由', trigger: 'blur' }
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
    submit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.isLoding = true
        const data = {
          applyType: this.auditObj.applyType,
          applyId: this.auditObj.applyId,
          auditState: this.form.auditState,
          auditReason: this.form.auditReason
        }
        audit(data).then(res => {
          this.isLoding = false
          if (res.data.state == 100) {
            this.dialogVisible = false
            this.$emit('getData')// 直接触发祖父组件事件
          }
        })
      })
    },
    show() {
      this.dialogVisible = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

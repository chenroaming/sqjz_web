<template>
  <el-dialog
    :visible.sync="centerDialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="创建抽查任务"
    width="30%"
    append-to-body
    center>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="汇报类型" prop="reportType">
        <el-select v-model="ruleForm.reportType" placeholder="请选择">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="矫正人员" prop="userIds" required>
        <selectDropdown
          ref="selectDropdown"
          v-model="ruleForm.userIds"
          :users.sync="users"
          key-word="name"
          key-id="userId"
          place-holder="请选择矫正人员"/>
      </el-form-item>
      <el-form-item label="汇报时限" prop="timeLimit">
        <el-input-number v-model="ruleForm.timeLimit" :min="1" label="请输入汇报时限"/>
        分钟
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="isLoading" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCommunityUserList } from '@/api/user'
import { add } from '@/api/reportTask'
import selectDropdown from '@/components/inputOrSpan/select-dropdown'
export default {
  name: 'Add',
  components: { selectDropdown },
  data() {
    const validUserList = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择矫正人员'))
      } else {
        callback()
      }
    }
    return {
      centerDialogVisible: false,
      isLoading: false,
      ruleForm: {
        reportType: 1,
        userIds: '',
        timeLimit: ''
      },
      option: [
        { label: '位置汇报', value: 1 },
        { label: '视频汇报', value: 2 }
      ],
      users: [],
      rules: {
        reportType: { required: true, message: '请选择汇报类型', trigger: ['blur', 'change'] },
        userIds: { validator: validUserList, trigger: ['blur', 'change'] },
        timeLimit: { required: true, message: '请填写汇报时限', trigger: ['blur', 'change'] }
      },
      userIdsArr: []
    }
  },
  computed: {

  },
  watch: {
    centerDialogVisible(cur, old) { // 关闭弹窗时重置数据
      if (!cur) {
        this.$refs['ruleForm'].resetFields()
        this.$refs.selectDropdown.reset()
      }
    }
  },
  created() {
    const data = {
      pageSize: 1000 // 一次性获取所有人员名单
    }
    getCommunityUserList(data).then(({ data: { state, list }}) => {
      state === '100' && (this.users = list.map(item => {
        return {
          ...item,
          checked: false
        }
      }))
    })
  },
  methods: {
    submit() { // 提交
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) return false
        this.isLoading = true
        add(this.ruleForm).then(({ data: { state }}) => {
          state === '100' && this.$emit('done') && (this.centerDialogVisible = false)
        })
          .finally(() => {
            this.isLoading = false
          })
      })
    },
    show() {
      this.centerDialogVisible = true
    }
  }
}
</script>

<style scoped lang = "scss">
  .el-dropdown-link {
    cursor: pointer;
  }
  .el-popper {
    max-height: 500px;
    overflow: auto;
  }
</style>

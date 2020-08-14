<template>
  <el-dialog
    :visible.sync="centerDialogVisible"
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
      <el-form-item label="矫正人员" prop="userList">
        <el-dropdown :hide-on-click="false" trigger="click">
          <span class="el-dropdown-link">
            {{ userList }}<i class="el-icon-arrow-down el-icon--right"/>
          </span>
          <!-- <el-input v-model="userList" suffix-icon="el-icon-arrow-down" placeholder="请选择矫正人员"/> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange">全选</el-checkbox>
            </el-dropdown-item>
            <el-dropdown-item
              v-for="(item,index) in users"
              :key="item.userId">
              <el-checkbox
                v-model="item.checked"
                @click.native.prevent="handleClick(index,item.name)">{{ item.name }}</el-checkbox>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
export default {
  name: 'Add',
  data() {
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
        { label: '语音汇报', value: 2 }
      ],
      users: [],
      rules: {
        reportType: { required: true, message: '请选择汇报类型', trigger: ['blur', 'change'] },
        // userList: { required: true, message: '请选择矫正人员', trigger: ['blur', 'change'] },
        timeLimit: { required: true, message: '请填写汇报时限', trigger: ['blur', 'change'] }
      },
      isIndeterminate: false,
      checkAll: false,
      userList: '请选择矫正人员',
      userIdsArr: []
    }
  },
  computed: {

  },
  watch: {
    centerDialogVisible(cur, old) { // 关闭弹窗时重置数据
      if (!cur) {
        this.$refs['ruleForm'].resetFields()
        this.userIdsArr = []
        this.userList = '请选择矫正人员'
        this.checkAll = false
        this.isIndeterminate = false
        this.users = this.users.map(item => {
          return {
            ...item,
            checked: false
          }
        })
      }
    }
  },
  mounted() {
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
        if (!this.userIdsArr.length > 0) return this.$message.warning('请选择矫正人员！')
        this.isLoading = true
        this.ruleForm.userIds = this.userIdsArr.map(item => item.userId).join(',')
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
    },
    handleCheckAllChange() {
      this.isIndeterminate = false
      this.users = this.users.map(item => {
        return {
          ...item,
          checked: this.checkAll // 每个选项根据是否全选状态进行勾选
        }
      })
      this.userIdsArr = this.checkAll ? [...this.users] : [] // 全选或者全不选
      this.userList = this.checkAll ? this.users.map(item => item.name).join('，') : '请选择矫正人员'
    },
    handleClick(index, userName) {
      this.users[index].checked = !this.users[index].checked
      this.users[index].checked
        ? this.userIdsArr.push(this.users[index]) // 勾选的选项加入数组
        : this.userIdsArr.splice(
          this.userIdsArr.findIndex(item => item.name === userName), 1) // 去勾选的选项从数组中删除
      this.userList = this.userIdsArr.length > 0 ? this.userIdsArr.map(item => item.name).join('，') : '请选择矫正人员'
      this.checkAll = this.users.every(item => item.checked) // 都选中了则全选勾上
      this.isIndeterminate = this.users.some(item => item.checked) && !this.checkAll // 只要有一个勾选并且没有全部勾选则处于半选中状态
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

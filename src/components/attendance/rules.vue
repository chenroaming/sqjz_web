<template>
  <el-dialog :visible.sync="dialogTableVisible" title="修改规则" width="35%" center>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item prop="ruleName" label="规则名称">
        <el-input v-model="form.ruleName"/>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="form.ruleType" placeholder="请选择" @change="changeType">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.ruleType === 2" prop="period" label="每周任意一天">
        <el-select v-model="form.period" placeholder="请选择">
          <el-option
            v-for="item in weekOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.ruleType === 3" prop="period" label="每月任意一天">
        <el-select v-model="form.period" placeholder="请选择">
          <el-option
            v-for="item in monthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间">
        <div v-for="(item,index) in form.clockRuleTimes" :key="index" style="margin-top: 5px;">
          <el-time-picker
            v-model="form.clockRuleTimes[index]"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH:mm:ss"/>
        </div>
        <div style="float: right;width: 30px;margin-top: 20px;">
          <el-button type="primary" icon="el-icon-plus" circle @click="addTime"/>
        </div>
        <div style="float: left;width: 30px;margin-top: 20px;">
          <el-button v-if="form.clockRuleTimes.length > 1" type="warning" icon="el-icon-delete" circle @click="delTime"/>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button :loading="isLoading" type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { update } from '@/api/attendance.js'
export default {
  name: 'Rules',
  props: {
    rulesObj: Object
  },
  data() {
    return {
      form: {
        clockRuleTimes: [],
        ruleId: '',
        ruleName: '测试',
        period: '',
        startTimes: '',
        endTimes: ''
      },
      value1: [],
      dialogTableVisible: false,
      monthOptions: [],
      weekOptions: [{ value: 'monday', label: '周一' }, { value: 'tuesday', label: '周二' }, { value: 'wednesday', label: '周三' }, { value: 'thursday', label: '周四' }, { value: 'friday', label: '周五' }, { value: 'saturday', label: '周六' }, { value: 'sunday', label: '周日' }],
      typeOptions: [{ value: 1, label: '每日' }, { value: 2, label: '每周' }, { value: 3, label: '每月' }],
      rules: {
        ruleName: [
          { required: true, message: '请填写规则名称', trigger: 'change' }
        ],
        period: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      isLoading: false
    }
  },
  computed: {

  },
  watch: {
    rulesObj(cur, old) {
      const newArr = cur.clockRuleTimes.map(item => {
        const timeArr = [item.startTime, item.endTime]
        return timeArr
      })
      this.form = { ...cur }
      this.form.clockRuleTimes = newArr
    }
  },
  mounted() {
    for (let i = 1; i <= 31; i++) {
      const item = {
        value: i,
        label: i
      }
      this.monthOptions.push(item)
    }
  },
  methods: {
    show() {
      this.dialogTableVisible = true
    },
    changeType(e) {
      this.form.period = e === 1 ? 'everyday' : null
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return this.$message.warning('请确保选项填写正确完整')
        this.isLoading = true
        const startStr = []
        const endStr = []
        for (const item of this.form.clockRuleTimes) {
          const [startTimeItem, endTimeItem] = item
          startStr.push(startTimeItem)
          endStr.push(endTimeItem)
        }
        const formObj = { ...this.form }
        formObj.startTimes = startStr.join(',')
        formObj.endTimes = endStr.join(',')
        update(formObj).then(res => {
          this.isLoading = false
          if (res.data.state == 100) {
            this.dialogTableVisible = false
            this.$emit('getList')
          }
        })
      })
    },
    addTime() {
      this.form.clockRuleTimes.push(['09:00:00', '10:00:00'])
    },
    delTime() {
      this.form.clockRuleTimes.pop()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

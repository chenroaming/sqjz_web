<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    title="新增任务"
    width="40%"
  >
    <el-form
      ref="addtaskrefs"
      :model="taskInfo"
      :rules="rules"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="规则名称" prop="taskName">
        <el-input v-model="taskInfo.taskName" />
      </el-form-item>
      <el-form-item label="规则类型" prop="taskType" required>
        <el-select v-model="taskInfo.taskType" placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in taskTypeList"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="taskInfo.taskType === '2'" label="自定义日期">
        <el-checkbox-group v-model="taskInfo.customDate">
          <el-checkbox-button
            v-for="item in dateList"
            :label="item.id"
            :key="item.id"
          >{{ item.value }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="考勤类型" required>
        <el-radio-group v-model="taskInfo.attendanceType">
          <el-radio-button label="1">上班</el-radio-button>
          <el-radio-button label="2">下班</el-radio-button>
          <el-radio-button label="0">其它</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          circle
          style="float:right"
          @click="handleAddNewCheckList"
        />
      </el-form-item>
      <el-form-item label="任务时间段" prop="timeRange">
        <el-time-picker
          v-model="taskInfo.timeRange"
          :clearable="false"
          style="width: 100%"
          is-range
          range-separator="至"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          arrow-control
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="submitForm('addtaskrefs')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
const taskTypeList = [
  { id: '0', value: '每天' },
  { id: '1', value: '法定工作日' },
  { id: '2', value: '自定义' }
]
const dateList = [
  { id: 'sunday', value: '星期日' },
  { id: 'monday', value: '星期一' },
  { id: 'tuesday', value: '星期二' },
  { id: 'wednesday', value: '星期三' },
  { id: 'thursday', value: '星期四' },
  { id: 'friday', value: '星期五' },
  { id: 'saturday', value: '星期六' }
]
import { addTask } from '@/api/attendance'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    var checkTasktype = (rule, value, callback) => {
      if (value === '2' && this.taskInfo.customDate.length === 0) {
        callback(new Error('请选择自定义考勤日期'))
      } else {
        callback()
      }
    }
    return {
      taskTypeList: taskTypeList,
      dateList: dateList,
      facesetList: [],
      webcamList: [],
      webcamIdStr: '',
      facesetIdStr: '',
      taskInfo: {
        taskName: '',
        taskType: '0',
        customDate: [],
        timeRange: ['09:00:00', '18:00:00'],
        startTime: '',
        endTime: '',
        attendanceType: '0'
      },

      bindingWebcams: [
        {
          id: 1,
          webcamValue: [],
          facesetValue: []
        }
      ],
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        timeRange: [
          {
            type: 'array',
            required: true,
            message: '请输入任务时间段',
            trigger: 'change'
          }
        ],
        taskType: [{ validator: checkTasktype, trigger: 'blur' }]
      }
    }
  },

  methods: {

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 当摄像头与绑定的人脸库只有一组但是其中一项为空时
          if (
            this.bindingWebcams.length === 1 &&
            (this.bindingWebcams[0].webcamValue === '' ||
              this.bindingWebcams[0].facesetValue.length === 0)
          ) {
            this.$message({
              type: 'warning',
              message: '请至少绑定一组摄像头与人脸库'
            })
            // 当摄像头与绑定的人脸库大于一组但是其中某项为空时
          } else if (this.handleDealBindingData() === true) {
            const customDateStr =
              this.taskInfo.taskType === '2'
                ? this.taskInfo.customDate.join(',')
                : ''
            addTask(
              this.taskInfo.taskName,
              this.facesetIdStr,
              this.webcamIdStr,
              this.taskInfo.taskType,
              this.taskInfo.timeRange[0],
              this.taskInfo.timeRange[1],
              this.taskInfo.attendanceType,
              customDateStr
            )
              .then(res => {
                this.handleReset()
                this.$message({ type: 'success', message: '更新成功' })
                this.$emit('submitSuccess')
              })
              .catch(() => {})
          }
        }
      })
    },

    // 判断当前是否符合提交条件
    handleDealBindingData() {
      const webcamIdsObj = []
      const facesetIdsObj = []
      let isCorret = true // 是否完成发送请求条件
      this.bindingWebcams.every(val => {
        if (val.webcamValue === '' || val.facesetValue.length === 0) {
          this.$message({
            type: 'warning',
            message: '绑定的摄像头或人脸库不能为空'
          })
          isCorret = false
          return false // 跳出every循环
        } else {
          webcamIdsObj.push(val.webcamValue.join(';'))
          facesetIdsObj.push(val.facesetValue.join(';'))
          return true
        }
      })
      this.webcamIdStr = webcamIdsObj.join(',')
      this.facesetIdStr = facesetIdsObj.join(',')
      return isCorret
    },

    // 新增摄像头绑定人脸库
    handleAddNewCheckList() {
      const obj = {
        id: parseInt(this.bindingWebcams.length + 1),
        webcamValue: [],
        facesetValue: []
      }
      this.bindingWebcams.push(obj)
    },

    // 移除绑定摄像头与人脸库
    handleRemoveBinding(index) {
      this.bindingWebcams.splice(index, 1)
    },

    // 关闭摄像头
    handleClose() {
      this.handleReset()
      this.$emit('closeModal')
    },

    // 重置数据
    handleReset() {
      this.webcamIdStr = ''
      this.facesetIdStr = ''
      this.$refs.addtaskrefs.resetFields()
      this.bindingWebcams = [{ id: 1, webcamValue: [], facesetValue: [] }]
      this.taskInfo = {
        taskName: '',
        taskType: '0',
        startTime: '',
        endTime: '',
        customDate: [],
        timeRange: ['09:00:00', '18:00:00']
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.divideLine {
  width: 100%;
  margin: 0 auto 20px auto;
  height: 1px;
  border-bottom: 1px solid #dcdfe6;
}

.bindingCameraList {
  max-height: 200px;
  overflow-y: auto;
}

.bindingCameraList::-webkit-scrollbar {
  width: 8px;
}

.bindingCameraList::-webkit-scrollbar-track {
  background-color: #fff;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

.bindingCameraList::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.3);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
</style>

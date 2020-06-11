/* eslint-disable handle-callback-err */
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
      <el-form-item label="任务名称" prop="ruleName">
        <el-input v-model="taskInfo.ruleName" />
      </el-form-item>
      <el-form-item label="任务类型" prop="ruleType" required>
        <el-select v-model="taskInfo.ruleType" placeholder="请选择" style="width:100%" @change="text">
          <el-option
            v-for="item in taskTypeList"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="taskInfo.ruleType === '2'" label="每周任意一天">
        <el-select v-model="taskInfo.period" placeholder="请选择每周任意一天">
          <el-option
            v-for="(item, index) in dateList"
            :key="index"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="taskInfo.ruleType === '3'" label="每月任意一天">
        <el-select v-model="taskInfo.period" placeholder="请选择每月任意一天">
          <el-option
            v-for="(item, index) in dateList2"
            :key="index"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <div class="bindingCameraList">
        <div v-for="(item, index) in bindtimelist" :key="item.id">
          <el-form-item label="任务时间段">
            <el-time-picker
              v-model="bindtimelist[index].timeRange"
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
          <el-form-item label>
            <el-button
              v-if="index !== 0"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="handleRemoveBinding(index)"
            />
          </el-form-item>
        </div>
      </div>
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="submitForm('addtaskrefs')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
const taskTypeList = [
  { id: "1", value: "每天" },
  { id: "2", value: "每周一次" },
  { id: "3", value: "每月一次" }
];
const dateList = [
  { id: "sunday", value: " 星期日" },
  { id: "monday", value: " 星期一" },
  { id: "tuesday", value: " 星期二" },
  { id: "wednesday", value: " 星期三" },
  { id: "thursday", value: " 星期四" },
  { id: "friday", value: " 星期五" },
  { id: "saturday", value: " 星期六" }
];
const dateList2 = [
  { id: "1", value: "1" },
  { id: "2", value: "2" },
  { id: "3", value: "3" },
  { id: "4", value: "4" },
  { id: "5", value: "5" },
  { id: "6", value: "6" },
  { id: "7", value: "7" },
  { id: "8", value: "8" },
  { id: "9", value: "9" },
  { id: "10", value: "10" },
  { id: "11", value: "11" },
  { id: "12", value: "12" },
  { id: "13", value: "13" },
  { id: "14", value: "14" },
  { id: "15", value: "15" },
  { id: "16", value: "16" },
  { id: "17", value: "17" },
  { id: "18", value: "18" },
  { id: "19", value: "19" },
  { id: "20", value: "20" },
  { id: "21", value: "21" },
  { id: "22", value: "22" },
  { id: "23", value: "23" },
  { id: "24", value: "24" },
  { id: "25", value: "25" },
  { id: "26", value: "26" },
  { id: "27", value: "27" },
  { id: "28", value: "28" },
  { id: "29", value: "29" },
  { id: "30", value: "30" },
  { id: "31", value: "31" }
];
import { addTask, addclock } from "@/api/attendance";
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dialogVisible: false
  },

  data() {
    // eslint-disable-next-line no-unused-vars
    var checkTasktype = (rule, value, callback) => {
      if (value === "2" && this.taskInfo.customDate.length === 0) {
        callback(new Error("请选择自定义考勤日期"));
      } else {
        callback();
      }
    };
    return {
      taskTypeList: taskTypeList,
      dateList: dateList,
      // 每周选一日
      dateList2: dateList2,
      // 每月选一日
      facesetList: [],
      webcamList: [],
      webcamIdStr: "",
      facesetIdStr: "",
      taskInfo: {
        ruleName: "",
        // 打卡任务类型
        ruleType: "1",
        // 规则类型 1每日，2每周，3每月
        period: "",
        // 周期
        customDate: [],
        timeRange: ["09:00:00", "18:00:00"],
        startTimestr: "",
        endTimestr: "",
        attendanceType: "3"
      },

      bindingWebcams: [
        {
          id: 1,
          webcamValue: [],
          facesetValue: []
        }
      ],
      bindtimelist: [
        {
          id: 1,
          startTime: [],
          endTime: [],
          timeRange: ["09:00:00", "18:00:00"]
        }
      ],
      rules: {
        ruleName: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: ["blur", "change"]
          }
        ]
        // timeRange: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请输入任务时间段",
        //     trigger: ["blur", "change"]
        //   }
        // ]
        // ruleType: [{ validator: checkTasktype, trigger: ["blur", "change"] }]
      }
    };
  },

  methods: {
    receiveTaskInfo() {},

    handtimeok() {
      // alert("调用");
      const startTime = [];
      const endTime = [];
      this.bindtimelist.every(val => {
        // console.log(val);
        if (val.timeRange === "") {
          this.$message({
            type: "warning",
            message: "绑定的时间不能为空"
          });
          // isCorret = false;
          return false; // 跳出every循环
        } else {
          var stringResult = val.timeRange[0].split(",");
          var stringResult1 = val.timeRange[1].split(",");
          startTime.push(stringResult.join(","));
          endTime.push(stringResult1.join(","));
          return true;
        }
      });
      this.taskInfo.startTimestr = startTime.join(",");
      this.taskInfo.endTimestr = endTime.join(",");
    },
    text() {
      if (this.taskInfo.period !== "") {
        this.taskInfo.period = "";
      }
    },

    // 获取摄像头列表
    getWebcamList() {
      getWebCamList("", 100)
        .then(res => {
          this.webcamList = res.data.List;
        })
        .catch(() => {});
    },

    // 提交表单
    submitForm(formName) {
      const self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert("验证通过");
          self.handtimeok();
          if (this.taskInfo.period === "") {
            this.taskInfo.period = "everyday";
          }
          // console.log(this.taskInfo);
          // return false;
          addclock(
            this.taskInfo.ruleName,
            this.taskInfo.ruleType,
            this.taskInfo.period,
            this.taskInfo.startTimestr,
            this.taskInfo.endTimestr
          )
            .then(res => {
              console.log(res);
              if (res.data.state == 100) {
                this.$message({ type: "success", message: "操作成功" });
                this.$emit("submitSuccess");
              } else {
                // this.$message({ type: "success", message:res.data.message });
                this.$message.error(res.data.message);
                this.$emit("submitSuccess");
              }
            })
            // eslint-disable-next-line handle-callback-err
            .catch(err => {});
        }
      });
    },
    // 新增时间段(社区矫正)
    handleAddNewCheckList() {
      const obj = {
        id: parseInt(this.bindtimelist.length + 1),
        timeRange: ["09:00:00", "18:00:00"],
        startTime: [],
        endTime: []
      };
      this.bindtimelist.push(obj);
    },

    // 移除时间段
    handleRemoveBinding(index) {
      this.bindtimelist.splice(index, 1);
    },

    // 关闭摄像头
    handleClose() {
      this.handleReset();
      this.$emit("closeModal");
    },

    // 重置数据
    handleReset() {
      this.webcamIdStr = "";
      this.facesetIdStr = "";
      this.$refs.addtaskrefs.resetFields();
      this.bindingWebcams = [{ id: 1, webcamValue: [], facesetValue: [] }];
      this.taskInfo = {
        taskName: "",
        taskType: "1",
        startTimestr: "",
        endTimestr: "",
        customDate: "",
        timeRange: ["09:00:00", "18:00:00"]
      };
    }
  }
};
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

<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    title="修改任务"
    width="40%"
  >
    <el-form
      ref="addtaskrefs"
      :model="taskInfo"
      :rules="rules"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="taskInfo.taskName" />
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType" required>
        <el-select v-model="taskInfo.taskType" placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in taskTypeList"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="taskInfo.taskType == '2'" label="自定义日期">
        <el-checkbox-group v-model="customDate">
          <el-checkbox-button
            v-for="item in dateList"
            :label="item.id"
            :key="item.value"
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
      <div class="bindingCameraList">
        <div v-for="(item, index) in bindingWebcams" :key="item.id">
          <el-form-item :required="index === 0 ? true : false" label="绑定摄像头集">
            <el-select
              v-model="bindingWebcams[index].webcamValue"
              multiple
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in webcamList"
                :key="item.webcamId"
                :label="item.webcamName"
                :value="item.webcamId"
              />
            </el-select>
          </el-form-item>
          <el-form-item :required="index === 0 ? true : false" label="绑定人脸库集">
            <el-select
              v-model="bindingWebcams[index].facesetValue"
              multiple
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in facesetList"
                :key="item.facesetId"
                :label="item.facesetName"
                :value="item.facesetId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label>
            <el-button
              v-if="index !==0"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="handleRemoveBinding(index)"
            />
          </el-form-item>
          <div class="divideLine" />
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
      <el-form-item label="任务时间段" prop="timeRange">
        <el-time-picker
          v-model="timeRange"
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
  { id: 0, value: "每天" },
  { id: 1, value: "法定工作日" },
  { id: 2, value: "自定义" }
];
const dateList = [
  { id: "sunday", value: "星期日" },
  { id: "monday", value: "星期一" },
  { id: "tuesday", value: "星期二" },
  { id: "wednesday", value: "星期三" },
  { id: "thursday", value: "星期四" },
  { id: "friday", value: "星期五" },
  { id: "saturday", value: "星期六" }
];
// import { getWebCamList } from '@/api/webcam'
import { getFacelibaryList } from "@/api/facelibary";
import { updateTask } from "@/api/attendance";
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dialogVisible: false
  },

  data() {
    var checkTasktype = (rule, value, callback) => {
      if (value === "2" && this.customDate.length === 0) {
        callback(new Error("请选择自定义考勤日期"));
      } else {
        callback();
      }
    };
    return {
      taskTypeList: taskTypeList,
      dateList: dateList,
      facesetList: [],
      webcamList: [],
      webcamIdStr: "",
      facesetIdStr: "",
      customDate: [],
      timeRange: ["09:00:00", "18:00:00"],
      taskInfo: {
        taskName: "",
        taskType: "0",
        customDate1: [],
        timeRange: ["09:00:00", "18:00:00"],
        startTime: "",
        endTime: "",
        attendanceType: ""
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
          { required: true, message: "请输入任务名称", trigger: "blur" }
        ],
        timeRange: [
          {
            type: "array",
            required: true,
            message: "请输入任务时间段",
            trigger: "change"
          }
        ],
        taskType: [{ validator: checkTasktype, trigger: "blur" }]
      }
    };
  },
  methods: {
    test(val) {
      debugger;
    },

    receiveTaskInfo(val) {
      // console.log('修改任务')
      // console.log(val)
      this.taskInfo = val;
      this.taskInfo.timeRange = [val.startTime, val.endTime];
      this.timeRange = [val.startTime, val.endTime];
      var dateArr = [];
      for (var i = 0; i < this.taskInfo.taskCycle.length; i++) {
        dateArr.push(this.taskInfo.taskCycle[i].dayOfWeek);
      }

      this.customDate = dateArr;
      // console.log('riqi')
      // console.log(dateArr)

      if (val.webcamFaceset.length == 0) {
        this.bindingWebcams[0].facesetValue = [];
        this.bindingWebcams[0].webcamValue = [];
      } else {
        var faceList = val.webcamFaceset;
        for (var i = 0; i < faceList.length; i++) {
          const infoItem = faceList[i];
          const arr = [];
          const arr2 = [];
          // 如果不止一组摄像头和人脸库，bindingWebcams对象数据要新增
          if (i > 0) {
            const obj = {
              id: parseInt(this.bindingWebcams.length + 1),
              webcamValue: [],
              facesetValue: []
            };
            this.bindingWebcams.push(obj);
          }
          for (const item of infoItem.facesetInfos) {
            arr.push(item.facesetId);
          }
          for (const item of infoItem.webcamInfos) {
            arr2.push(item.webcamId);
          }
          this.bindingWebcams[i].facesetValue = arr;
          this.bindingWebcams[i].webcamValue = arr2;
          console.log(this.bindingWebcams);
        }

        // for(var i=0;i<faceList.length;i++){
        //     arr.push(faceList[i].facesetId)
        // }
        // this.bindingWebcams[0].facesetValue=arr;
        // // console.log(arr)

        // var webList=val.webcamFaceset[0].webcamInfos;
        // var arr2=[];
        // for(var i=0;i<webList.length;i++){
        //     arr2.push(webList[i].webcamId)
        // }
        // this.bindingWebcams[0].webcamValue=arr2;
        // // console.log(arr2)
      }

      this.getFacesetList();
      this.getWebcamList();
    },

    // 获取人脸库列表
    getFacesetList() {
      getFacelibaryList("task", "", "", "")
        .then(res => {
          this.facesetList = res.data.List;
        })
        .catch(() => {
          this.facesetList = [];
          this.$message({ type: "error", message: "绑定人脸库集获取失败！" });
        });
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 当摄像头与绑定的人脸库只有一组但是其中一项为空时
          if (
            this.bindingWebcams.length === 1 &&
            (this.bindingWebcams[0].webcamValue === "" ||
              this.bindingWebcams[0].facesetValue.length === 0)
          ) {
            this.$message({
              type: "warning",
              message: "请至少绑定一组摄像头与人脸库"
            });
            // 当摄像头与绑定的人脸库大于一组但是其中某项为空时
          } else if (this.handleDealBindingData() === true) {
            var customDateStr =
              this.taskInfo.taskType == "2" ? this.customDate.join(",") : "";
            // console.log('zhouqi'+customDateStr)
            updateTask(
              this.taskInfo.taskId,
              this.taskInfo.taskName,
              this.facesetIdStr,
              this.webcamIdStr,
              this.taskInfo.taskType,
              this.timeRange[0],
              this.timeRange[1],
              this.taskInfo.attendanceType,
              customDateStr
            )
              .then(res => {
                this.handleReset();
                this.$message({ type: "success", message: "更新成功" });
                this.$emit("submitSuccess");
              })
              .catch(() => {});
          }
        }
      });
    },

    // 判断当前是否符合提交条件
    handleDealBindingData() {
      const webcamIdsObj = [];
      const facesetIdsObj = [];
      let isCorret = true; // 是否完成发送请求条件
      this.bindingWebcams.every(val => {
        if (val.webcamValue === "" || val.facesetValue.length === 0) {
          this.$message({
            type: "warning",
            message: "绑定的摄像头或人脸库不能为空"
          });
          isCorret = false;
          return false; // 跳出every循环
        } else {
          webcamIdsObj.push(val.webcamValue.join(";"));
          facesetIdsObj.push(val.facesetValue.join(";"));
          return true;
        }
      });
      this.webcamIdStr = webcamIdsObj.join(",");
      this.facesetIdStr = facesetIdsObj.join(",");
      return isCorret;
    },

    // 新增摄像头绑定人脸库
    handleAddNewCheckList() {
      const obj = {
        id: parseInt(this.bindingWebcams.length + 1),
        webcamValue: [],
        facesetValue: []
      };
      this.bindingWebcams.push(obj);
    },

    // 移除绑定摄像头与人脸库
    handleRemoveBinding(index) {
      this.bindingWebcams.splice(index, 1);
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
        taskType: "0",
        startTime: "",
        endTime: "",
        customDate: [],
        timeRange: ["09:00:00", "18:00:00"]
      };
    },

    // 全选
    changeSelect(val) {
      const allValues = [];
      // 保留所有值
      for (const item of this.facesetList) {
        allValues.push(item.value);
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal =
        this.bindingWebcams[0].facesetValue.length === 1
          ? bindingWebcams[0].facesetValue[0]
          : [];
      // 若是全部选择
      if (val.includes("ALL_SELECT"))
        this.bindingWebcams[0].facesetValue = allValues;
      // 取消全部选中 上次有 当前没有 表示取消全选
      if (oldVal.includes("ALL_SELECT") && !val.includes("ALL_SELECT"))
        this.bindingWebcams[0].facesetValue = [];
      // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes("ALL_SELECT") && val.includes("ALL_SELECT")) {
        const index = val.indexOf("ALL_SELECT");
        val.splice(index, 1); // 排除全选选项
        this.bindingWebcams[0].facesetValue = val;
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes("ALL_SELECT") && !val.includes("ALL_SELECT")) {
        if (val.length === allValues.length - 1)
          this.bindingWebcams[0].facesetValue = ["ALL_SELECT"].concat(val);
      }
      // 储存当前最后的结果 作为下次的老数据
      this.bindingWebcams[0].facesetValue[0] = this.bindingWebcams[0].facesetValue;
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

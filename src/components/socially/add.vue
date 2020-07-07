<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="发布公益活动"
    center
    width="40%">
    <el-form ref="form" :model="form" :rules="rules" label-width="135px">
      <el-form-item prop="theme" label="活动主题">
        <el-input v-model="form.theme"/>
      </el-form-item>
      <el-form-item prop="content" label="活动内容">
        <el-input v-model="form.content"/>
      </el-form-item>
      <!-- <el-form-item prop="location" label="活动地点">
        <el-input v-model="form.location"></el-input>
      </el-form-item> -->
      <el-form-item label="活动地点" prop="location">
        <el-input
          v-if="form.location !=''"
          :value="form.location"
          style="margin-top:10px"
          placeholder="请选择活动地点"
          disabled
        />
        <el-button
          v-if="form.longitude =='' && form.longitude ==''"
          type="primary"
          size="mini"
          @click="showMap = true"
        >添加区域坐标</el-button>
        <el-button
          v-if="form.longitude !='' && form.longitude !=''"
          type="primary"
          size="mini"
          @click="showMap = true"
        >修改区域坐标</el-button>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isChoice" label="指派人员">
        <el-button type="primary" @click="getUserList">点击选择指派人员</el-button>
        <el-input v-show="getChoiceList" v-model="getChoiceList" type="textarea" disabled/>
      </el-form-item>
      <el-form-item label="活动起止时间" prop="activeTime" width="100%">
        <el-date-picker
          v-model="form.activeTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%;"/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="isLoading" type="primary" @click="submit">确 定</el-button>
    </span>
    <userList ref="userList" :assign-arr.sync="assignArr"/>
    <Getmap ref="getmapRefs" :value="showMap" @map-confirm="getPoint" @cancel="cancelPoint" />
  </el-dialog>
</template>

<script>
import Getmap from '@/components/getmap/getmap'
import { add } from '@/api/socially'
import userList from './userList.vue'
export default {
  name: 'Add',
  components: {
    userList,
    Getmap
  },
  data() {
    return {
      dialogVisible: false,
      isLoading: false,
      options: [{ value: 0, label: '指派' }, { value: 1, label: '自助报名' }],
      options2: [{ value: 0, label: '未开始' }, { value: 1, label: '已开始' }, { value: 2, label: '已结束' }],
      form: {
        theme: '',
        content: '',
        location: '',
        longitude: '',
        latitude: '',
        type: '',
        startDate: '',
        endDate: '',
        state: '',
        integral: '',
        limitedNumber: '',
        userIds: '',
        activeTime: []
      },
      assignArr: [],
      showMap: false,
      rules: {
        theme: [
          { required: true, message: '请输入活动主题', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入活动内容', trigger: 'change' }
        ],
        location: [
          { required: true, message: '请选择活动地点', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        activeTime: [
          { type: 'array', message: '请选择活动起止时间', required: true, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    getChoiceList() {
      return this.assignArr.map(item => item.name).join(',')
    },
    getChoiceListId() {
      return this.assignArr.map(item => item.id).join(',')
    },
    isChoice() {
      return this.form.type === 0
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
        const [startDate, endDate] = this.form.activeTime
        this.form.startDate = startDate
        this.form.endDate = endDate
        this.form.userIds = this.getChoiceListId
        this.isLoading = true
        add(this.form).then(res => {
          this.isLoading = false
          if (res.data.state == 100) {
            this.form = {}
            this.dialogVisible = false
            this.$emit('done')
            this.$refs['form'].resetFields()
          }
        })
      })
    },
    getUserList() {
      this.$refs.userList.show()
    },
    getPoint(val) {
      this.showMap = false
      if (val) {
        this.form.location = val.dw
        this.form.longitude = val.lng
        this.form.latitude = val.lat
      }
    },
    cancelPoint() {
      this.showMap = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

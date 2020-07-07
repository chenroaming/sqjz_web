<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="查看信息"
    center
    width="30%">
    <el-form v-for="(item,index) in detail.userInfos" :key="index" label-width="80px">
      <el-form-item label="姓名">
        <span>{{ item.name }}</span>
      </el-form-item>
      <el-form-item label="照片">
        <el-image
          :src="item.picPath"
          style="width: 100px; height: 100px"/>
      </el-form-item>
      <el-form-item label="手机号">
        <span>{{ item.phone }}</span>
      </el-form-item>
    </el-form>
    <el-form label-width="80px">
      <el-form-item label="处置日期">
        <span>{{ exChangeTime }}</span>
      </el-form-item>
      <el-form-item label="处置人">
        <span>{{ detail.disposeAdmin }}</span>
      </el-form-item>
      <el-form-item label="发生原因">
        <span>{{ detail.reason }}</span>
      </el-form-item>
      <el-form-item label="处置结果">
        <span>{{ detail.result }}</span>
      </el-form-item>
    </el-form>
    <el-form v-if="detail.warningType == '失联'" label-width="80px">
      <el-form-item label="失联时间">
        <span>{{ detail.missingDate }}</span>
      </el-form-item>
      <el-form-item label="复联时间">
        <span>{{ detail.recoveryDate }}</span>
      </el-form-item>
      <el-form-item label="时长">
        <span>{{ detail.duration }}</span>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ShowDetail',
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    exChangeTime() {
      return this.detail.disposeDate ? `${new Date(this.detail.disposeDate.time).getFullYear()}-${(new Date(this.detail.disposeDate.time).getMonth() + 1)}-${new Date(this.detail.disposeDate.time).getDate()}   ${new Date(this.detail.disposeDate.time).getHours()}:${new Date(this.detail.disposeDate.time).getMinutes()}` : ''
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.dialogVisible = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

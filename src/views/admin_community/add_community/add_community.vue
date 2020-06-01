<template>
  <div>
    <!-- <h1>区域</h1> -->
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :role-type="roleType"
      title="新增区域司法所"
      width="35%"
      top="1%"
    >
      <el-form label-width="80px">
        <!-- 省份 -->
        <el-form-item label="区域省份:">
          <el-select v-model="province" placeholder="请选择省份">
            <el-option
              v-for="item in provincelist"
              :key="item.value"
              :label="item.communityName"
              :value="item.communityName"
            >
              <span style="float: left">{{ item.communityName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 市级 -->
        <el-form-item label="区域市级:">
          <el-select v-model="city" placeholder="请选择市级">
            <el-option
              v-for="item in citylist"
              :key="item.value"
              :label="item.communityName"
              :value="item.communityName"
            >
              <span style="float: left">{{ item.communityName }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 区级 -->
        <el-form-item label="区域区级:">
          <el-select v-model="area" placeholder="请选择区">
            <el-option
              v-for="item in arealist"
              :key="item.value"
              :label="item.communityName"
              :value="item.communityName"
            >
              <span style="float: left">{{ item.communityName }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="司法所名:" style="width: 280px;">
          <el-input v-model="communityName" placeholder="请输入司法所名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleSubmit('addusermodalrefs')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getallcommunity, addcommunity } from '@/api/community'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dialogVisible: false,
    // eslint-disable-next-line vue/require-default-prop
    roleType: 0
  },
  data() {
    return {
      // 省份列表
      provincelist: [],
      // 省份名称
      province: '',

      // 市级列表
      citylist: [],
      // 市级名称
      city: '',

      // 区级列表
      arealist: [],
      // 区域名称
      area: '',
      // 司法所名称
      communityName: ''
    }
  },
  // 侦听器
  watch: {
    // 省字段侦听
    province: function() {
      // alert("省改变");
      this.updatecommunity()
      this.updatecity()
    },
    // 市字段侦听
    city: function() {
      // alert("市改变");
      this.updatecity()
    },
    // 区侦听器
    area: function() {
      // alert("区改变");
    }
  },
  methods: {
    // 初始化方法
    __init() {
      this.fetchGetAreaList()
    },
    handleSubmit() {
      if (this.province == '' || this.city == '' || this.area == '') {
        // alert("请选择所属的:省/市/区域");
        this.$message({
          message: '请选择所属的:省/市/区域',
          type: 'warning'
        })
        return false
      }
      if (this.communityName == '') {
        // alert("请输入司法所名称");
        this.$message({
          message: '请输入司法所名称',
          type: 'warning'
        })
        return false
      }
      for (var i in this.arealist) {
        var obj = this.arealist[i]
        if (obj.communityName == this.area) {
          this.areaid = obj.communityId
          break
        }
      }
      addcommunity(this.areaid, this.communityName)
        .then(res => {
          console.log(res)
          if (res.data.state == '100' || res.data.state == 100) {
            this.$message({
              message: '创建区域成功',
              type: 'success'
            })

            this.$emit('submitSuccess')
          }
        })
        .catch(() => {})
      // console.log(this.areaid);
    },
    // 获取区域列表
    fetchGetAreaList() {
      getallcommunity()
        .then(res => {
          console.log('获取可用区域')
          console.log(res)
          this.provincelist = res.data.list
          this.province = this.provincelist[0].communityName
          this.citylist = res.data.list[0].childList
          this.city = this.citylist[0].communityName
          this.arealist = res.data.list[0].childList[0].childList
          this.area = this.arealist[0].communityName
        })
        .catch(() => {})
    },

    // 关闭弹窗
    handleClose() {
      this.communityName = ''
      this.$emit('closeModal')
    },
    // 省的更新
    updatecommunity: function() {
      // alert("调用了省改变函数");
      for (var i in this.provincelist) {
        var obj = this.provincelist[i]
        if (obj.communityName == this.provincelist) {
          this.citylist = obj.childList
          break
        }
      }
      this.city = this.citylist[0].communityName
    },
    // 市区的更新
    updatecity: function() {
      for (var i in this.citylist) {
        var obj = this.citylist[i]
        if (obj.communityName == this.city) {
          this.arealist = obj.childList
          break
        }
      }
      if (
        this.arealist &&
        this.arealist.length > 0 &&
        this.arealist[0].communityName
      ) {
        this.area = this.arealist[0].communityName
      } else {
        this.area = ''
      }
    }
  }
}
</script>

<style scoped>
</style>

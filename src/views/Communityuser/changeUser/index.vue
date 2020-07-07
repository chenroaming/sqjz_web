<script>
import userFile from '@/components/userFile/userFile.vue'
import buttonBox from './button.vue'
import changeUser from './changeUser'
export default {
  components: {
    changeUser,
    userFile,
    buttonBox
  },
  props: {
    dialogVisible: {
      default: false,
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      userFileList: [
        { fileType: 1, fileText: '基本信息表' },
        { fileType: 2, fileText: '定位监管承诺书' },
        { fileType: 3, fileText: '告知书' },
        { fileType: 4, fileText: '宣告书' },
        { fileType: 5, fileText: '责任书' },
        { fileType: 6, fileText: '软件监管承诺书' }
      ],
      userInfo: {

      },
      imageUrl: ''
    }
  },
  mounted() {
    /* params无法跨页面传递，暂时用本地存储解决 */
    const userInfo = this.$route.params.userId ? this.$route.params : JSON.parse(window.localStorage.getItem('CommunituserInfo'))
    window.localStorage.getItem('CommunituserInfo') && window.localStorage.removeItem('CommunituserInfo')
    if (!userInfo) {
      this.$router.push({ path: '/Communityuser/index' })
      return
    }
    this.userInfo = { ...userInfo }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .formItem {
    width: 50%;
    float: left;

    .formInput {
      width: 200px;
    }
  }
</style>

<template>
  <div style="padding:10px">
    <router-link :to="{ path: '/Communityuser/index' }" style="margin-bottom:10px">
      <el-button icon="el-icon-back" circle/><span style="margin-left:10px;">返回</span>
    </router-link>
    <el-card class="box-card" style="margin-top:10px">
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-row :gutter="20">
        <changeUser :get-user-info="userInfo"/>
        <el-col :span="8">
          <buttonBox :user-info="userInfo"/>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" style="margin-top: 10px;">
      <div slot="header">
        <span>入矫文书材料</span>
      </div>
      <el-row :gutter="20">
        <el-col v-for="(item, index) in userFileList" :span="8" :key="index" style="margin-bottom:10px;">
          <userFile
            ref="userFile"
            :user-id="userInfo.userId"
            :user-files="userInfo.userFiles"
            :file-type="item.fileType"
            :file-text="item.fileText"
            style="width: 100%;"/>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

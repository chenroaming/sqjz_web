<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    title="权限配置">
    <el-row>
      <p class="title">姓名：{{ user.name }}</p>
    </el-row>
    <el-row>
      <p class="title">所属区域：{{ user.communityName }}</p>
    </el-row>
    <div class="tree-box">
      <el-tree
        ref="authTree"
        :data="getAuthTree"
        :props="defaultProps"
        :default-expanded-keys="['sysmanage:admin']"
        :default-checked-keys="defaultChecked"
        :highlight-current="highlight"
        show-checkbox
        node-key="authorityCode"/>
    </div>
    <div style="text-align: center;">
      <el-button type="success" @click="submit">提交修改</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { findAuthority, updateAuthority } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          communityName: '',
          adminId: ''
        }
      }
    }
  },
  data() {
    return {
      highlight: true,
      drawer: false,
      direction: 'rtl',
      authTree: [], // 权限列表数组
      defaultProps: {// 权限字段配置
        children: 'childList',
        label: 'authorityName'
      },
      defaultChecked: []// 已拥有的权限
    }
  },
  computed: {
    getAuthTree() {
      return this.authTree
    }
  },
  methods: {
    show({ adminId }) {
      findAuthority(adminId).then(({ data: { state, authorityList, authorityCodes }}) => {
        if (state === '100') {
          this.authTree = authorityList
          this.defaultChecked = authorityCodes
        }
      })
      this.drawer = true
    },
    submit() {
      this.$confirm('确认修改该用户权限配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const checkedKeys = this.$refs.authTree
          .getCheckedKeys()
          .concat(this.$refs.authTree
            .getHalfCheckedKeys())
          .join(',') // 全选和半选的权限都需要发送
        updateAuthority(this.user.adminId, checkedKeys)
      }).catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
  .title{
    color: #909399;
    margin-bottom: 0;
    padding: 0 15px;
    font-weight: bold;
  }
  .tree-box{
    padding: 20px 20px;
    height: 500px;
    overflow: auto;
  }
</style>

<template>
  <el-dropdown :hide-on-click="false" trigger="click">
    <span class="el-dropdown-link">
      {{ userList }}<i class="el-icon-arrow-down el-icon--right"/>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-input v-model="word" placeholder="请输入搜索名称" style="width: 80%;margin: 0 auto;display: block;"/>
      <el-tree
        ref="tree"
        :default-expanded-keys="['全部']"
        :node-key="keyId"
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        show-checkbox
        @check-change="clickNode"/>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'SelectDropdown',
  model: {
    prop: 'userIds',
    event: 'change'
  },
  props: {
    users: { // 传入的数据数组
      type: Array,
      default: () => ([])
    },
    placeHolder: { // 要默认显示的名称
      type: String,
      default: '请选择'
    },
    userIds: { // 父组件v-model绑定的值
      type: String,
      default: ''
    },
    keyWord: { // 数组中要显示的属性名称
      type: String,
      default: ''
    },
    keyId: { // 要回传的对象的属性
      type: String,
      default: ''
    }
  },
  data() {
    return {
      word: '',
      userList: this.placeHolder,
      defaultProps: {
        children: 'children',
        label: this.keyWord
      }
    }
  },
  computed: {
    treeData() {
      return [
        {
          userId: '全部',
          name: '全部',
          children: [...this.users]
        }
      ]
    }
  },
  watch: {
    word(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    clickNode(data, Node, tree) {
      const choiceNode = this.$refs.tree.getCheckedNodes()
      this.userList = choiceNode.length > 0
        ? choiceNode
          .filter(({ userId }) => userId !== '全部') // 将全部这个选项去掉
          .map(item => item[this.keyWord]) // 仅提取要用的字段组成数组
          .join('，') : this.placeHolder // 拼接为字符串进行展示
      this.$emit('change', choiceNode.length > 0
        ? choiceNode
          .filter(({ userId }) => userId !== '全部')
          .map(item => item[this.keyId])
          .join('，') : '') // 拼接为字符串方便后端解析
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.includes(value)
    },
    reset() {
      this.userList = this.placeHolder
      this.word = ''
      this.$refs.tree.setCheckedKeys([])
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

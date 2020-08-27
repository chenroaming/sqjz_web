<template>
  <el-cascader
    v-model="value"
    :options="options"
    :props="setProps"
    size="mini"
    placeholder="请选择司法所"
    filterable
    @change="handleChange"/>
</template>

<script>
import { getallcommunity } from '@/api/community'
export default {
  name: 'AreaCascader',
  data() {
    return {
      options: [],
      value: '',
      setProps: {
        value: 'communityId',
        label: 'communityName'
      }
    }
  },
  computed: {

  },
  created() {
    getallcommunity().then(({ data: { list }}) => {
      this.options = this.filterArr(list)
    })
  },
  methods: {
    filterArr(arr) {
      // 因后端给的数据里有childList为空数组的情况，空数组也会被级联组件渲染且无法选中，因此递归处理一下
      const newArr = arr.map(({ communityId, communityName, childList }) => {
        return childList.length < 1 ? {
          communityId,
          communityName
        } : {
          communityId,
          communityName,
          children: this.filterArr(childList)
        }
      })
      return newArr
    },
    handleChange() {
      console.log([...this.value].pop())
    }
  }
}
</script>

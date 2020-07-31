<template>
  <div>
    <span v-if="typeName === 'span'" :title="value" class="textWord">{{ value }}</span>
    <el-input
      v-if="typeName === 'input'"
      v-model="value"
      :class="className"
      :placeholder="placeholder"
      @change="emitValue"/>
    <el-select
      v-if="typeName === 'select'"
      :class="className"
      v-model="value"
      @change="emitValue">
      <el-option
        v-for="item in selectArr"
        :key="item.id"
        :label="item.value"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    vValue: { // 传入的值
      type: [Number, String],
      default: ''
    },
    typeName: { // 标签名
      type: String,
      default: ''
    },
    className: { // 自定义样式名
      type: String,
      default: ''
    },
    placeholder: { // 懂的都懂
      type: String,
      default: ''
    },
    selectArr: { // 下拉框选项
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    vValue(cur, old) {
      if (this.typeName === 'span' && this.selectArr.length > 0) { // span标签纯显示时的数据处理
        const { value } = this.selectArr.find(element => element.id === cur)
        this.value = value
        return true
      }
      this.value = cur
    }
  },
  mounted() {

  },
  methods: {
    emitValue() {
      this.$emit('update:vmodel', this.value) // 提交父组件改值
    }
  }
}
</script>

<style lang = "scss" scoped>
  .textWord {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: block;
    white-space: nowrap;
    word-break: break-all;
  }
</style>

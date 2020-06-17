<template>
  <div class="main">
    <div class="searchArea">
      <slot name="extraArea"></slot>
      <el-button
        type="primary"
        style="margin-left:20px;margin:20px;"
        @click="$emit('handleSearch')"
        v-if="searBtnShow"
        >搜索</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-refresh"
        circle
        @click="$emit('refreshData')"
      ></el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchData: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "请输入内容"
    },
    visible: {
      type: Boolean,
      default: true
    },
    searBtnShow: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      test: "hello",
      searchText: this.searchData
    };
  },

  watch: {
    searchData: function(newVal, oldVal) {
      this.searchText = newVal;
    }
  },

  methods: {
    changeInputContent(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.searchArea {
  width: 98%;
  height: 50px;
  margin: 5px auto;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: flex-end;
}
</style>

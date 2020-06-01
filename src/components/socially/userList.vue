<template>
  <el-dialog
    title="矫正人员列表"
    :visible.sync="dialogVisible"
    center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="450px">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="250"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="300"
        align="center">
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { findUserList } from '@/api/socially'
  export default {
    name: "userList",
    data() {
      return {
        dialogVisible:false,
        tableData:[],
        multipleSelection:[],
      }
    },
    computed: {

    },
    mounted() {

    },
    methods: {
      show(){
        this.dialogVisible = true;
        findUserList().then(res => {
          this.tableData = res.data.list;
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      confirm(){
        const newArr = this.multipleSelection.map(item => {
          return {
            name:item.name,
            id:item.userId
          }
        })
        this.$emit('update:assignArr',newArr);
        this.dialogVisible = false;
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

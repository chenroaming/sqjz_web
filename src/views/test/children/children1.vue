<script>
import md5 from 'md5'
import { arrayTest } from '@/api/test'
export default {
  name: 'Children1',
  data() {
    return {
      word: 'test2',
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      tabledata2: [
        {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      multipleSelection: [],
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ],
      data2: [
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park'
        }
      ]
    }
  },
  methods: {
    send() {
      const p2 = md5(13859933999 + 'salt0611' + p1)
      const p1 = btoa(13859933999).split('').reverse().join('')
      console.log(`p1是${p1}`, `p2是${p2}`)
      this.data1 = this.data2
      // this.tableData = this.tabledata2
      // const data = {
      //   test: [[{ index: 1, label: 'test1' }], [{ index: 2, label: 'test2' }], [{ index: 3, label: 'test3' }]]
      // }
      // arrayTest(data).then(({ data }) => {
      //   console.log(data)
      //   this.word = data
      // })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    handleChange(e) {
      console.log(e)
    },
    getLi() {
      console.log(this.$refs.li)
    }
  }
}
</script>

<style scoped lang="scss">
  .flexBox {
    display: flex;
    width: 300px;
    height: 300px;
    border: 1px solid;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    div{
      width: 20%;
      height: 20%;
      border:1px solid;
    }
  }
  .cuizhi {
    width: 100px;
    height: 100px;
    span {
      display: inline-block;
    }
  }
</style>

<template>
  <div style="margin-left: 100px;">
    <span>{{ word }}</span>
    <el-button type="primary" @click="send">测试传输</el-button>
    <div class="flexBox">
      <div>1</div>
      <div>2</div>
      <div>33333</div>
      <!-- <div>1</div>
      <div>2</div>
      <div>3</div> -->
    </div>
    <div class="cuizhi">
      <span>111</span>
    </div>
    <ul>
      <li
        v-for="item in data2"
        ref="li"
        :key="item.address"
        :aaa="item.value"
        @click="getLi">{{ item.name }}</li>
    </ul>
    <!-- <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column
        label="日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120"/>
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip/>
    </el-table> -->
    <!-- <Table
      ref="selection"
      :columns="columns4"
      :data="data1"
      border
      @on-selection-change="handleChange"/> -->
  </div>
</template>

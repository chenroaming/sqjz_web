<template>
  <!-- 原来的关联人员模块，已改版至facecurd2，暂时不用 -->
  <div
    v-if="authDrawerVisible"
    :class="authDrawerVisible?'auth-animateFadeIn':''"
    class="auth-mask"
    style="z-index:1000"
    @click="handleClose"
  >
    <transition :appear="true" name="slideIn" mode="out-in">
      <div v-loading="isLoadingEnd" ref="facecurdDrawer" class="auth-wrap" @click.stop>
        <el-button
          icon="el-icon-close"
          circle
          class="closeBtn"
          size="mini"
          @click.stop
          @click="handleClose"
        />
        <div class="wrap-header">
          <p style="color:#606266;font-size:20px;margin-bottom:10px">{{ facesetInfo.facesetName }}</p>
        </div>
        <div class="wrap-user">
          <el-radio-group
            v-model="tabPosition"
            size="mini"
            style="line-height: 50px;display: inline-block;"
            @change="label=>{tabPosition = label}"
          >
            <el-radio label="delete">已有人员</el-radio>
            <el-radio label="add">添加人员</el-radio>
          </el-radio-group>
          <div style="display: inline-block;height: 50px;line-height: 50px;float: right;">
            <el-input v-model="userName" style="width: 150px;" placeholder="请输入姓名"/>
            <el-button type="primary" @click="search">搜索</el-button>
          </div>
        </div>

        <div v-show="tabPosition === 'add'" class="addFace">
          <el-table
            ref="addFaceTable"
            :data="addTableInfo.tableData"
            tooltip-effect="dark"
            class="addTable"
            height="80px"
            style="width:100%;margin-top:20px"
            @selection-change="handleSelectionChangeAdd"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="人脸图像" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.picPath" alt style="width:80px;height:100px;cursor:pointer" >
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="center" />
          </el-table>
          <Sortpage
            :total-pages="addTableInfo.totalPages"
            :current-page="addTableInfo.currentPage"
            :sort-show="addTableInfo.sortShow"
            class="faceSortPage"
            @sizeChange="sizeChangeAdd"
          />
          <div class="addFace-footer" align="center">
            <el-button type="primary" round @click="submitFaceListAdd">添加人员</el-button>
          </div>
        </div>

        <div v-show="tabPosition === 'delete'" class="deleteFace">
          <el-table
            ref="multipleTable"
            :data="deleteTableInfo.tableData"
            tooltip-effect="dark"
            class="addTable"
            height="80px"
            style="width:100%;margin-top:20px;"
            @selection-change="handleSelectionChangeDelete"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="人脸图像" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.picPath" alt style="width:80px;height:100px;cursor:pointer" >
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="center" />
          </el-table>
          <Sortpage
            :total-pages="deleteTableInfo.totalPages"
            :current-page="deleteTableInfo.currentPage"
            :sort-show="deleteTableInfo.sortShow"
            class="faceSortPage"
            @sizeChange="sizeChangeDelete"
          />
          <div class="addFace-footer">
            <el-button type="danger" round @click="submitFaceListDelete">移除人员</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getFaceList } from '@/api/face'
import { addFaceInfo, deleteFaceInfo } from '@/api/facelibary'
import Sortpage from '@/components/sortpage/sortpage'
// eslint-disable-next-line no-unused-vars
import { Message, MessageBox } from 'element-ui'
// eslint-disable-next-line no-unused-vars
import { resolve, reject } from 'q'
export default {
  components: {
    Sortpage
  },

  props: {
    // 抽屉状态
    authDrawerVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      facesetInfo: {}, // 人脸库信息
      searchfaceName: '', // 搜索名称
      tabPosition: 'delete', // 切换选项标识
      isLoadingEnd: true,
      addTableInfo: {
        tableData: [{ name: '测试' }],
        currentPage: 1,
        sortShow: true,
        multipleSelection: [],
        totalPages: 0
      },
      deleteTableInfo: {
        // eslint-disable-next-line quotes
        tableData: [{ name: "测试" }],
        currentPage: 1,
        sortShow: true,
        multipleSelection: [],
        totalPages: 0
      },
      userName: ''
    }
  },

  methods: {
    // 关闭抽屉
    closeModal() {
      this.$emit('closeModal')
    },

    // 接收信息
    receiveInfo(payload) {
      this.facesetInfo = Object.assign({}, payload)
      console.log(this.facesetInfo)
      Promise.all([this.getAddFaceList(), this.getDeleteFaceList()])
        .then(nameList => {
          this.isLoadingEnd = false
          nameList.forEach(val => {
            this[val].sortShow = false
            this.$nextTick(() => {
              this[val].sortShow = true
            })
          })
        })
        .catch(payload => {
          this.isLoadingEnd = false
          // this.$message({ type: 'error', message: payload.msg })
        })
    },

    search() {
      if (this.tabPosition == 'add') {
        this.getAddFaceList('add', this.facesetInfo.ruleId, this.userName, 1)
      } else {
        this.getDeleteFaceList('find', this.facesetInfo.ruleId, 10, 1, this.userName)
      }
    },

    // 添加人脸-获取列表
    getAddFaceList(type = 'add', ruleId = this.facesetInfo.ruleId, name, num) {
      return new Promise((resolve, reject) => {
        getFaceList(type, ruleId, 10, num, name)
          .then(res => {
            console.log(res.data.list)
            this.addTableInfo.tableData = []
            this.addTableInfo.totalPages = 0
            if (res.data.list.length !== 0) {
              this.addTableInfo.currentPage = res.data.pageNumber
              this.addTableInfo.tableData = res.data.list
              this.addTableInfo.totalPages = res.data.total
              resolve('addTableInfo')
            }
          })
          .catch(() => {
            this.addTableInfo.tableData = []
            // this.$message.warning('无相关信息')
            reject({ msg: '暂无数据(添加)' })
          })
      })
    },

    // 添加人脸-全选
    handleSelectionChangeAdd(val) {
      this.addTableInfo.multipleSelection = val
    },
    // 添加全部
    addAll() {
      MessageBox.confirm('您确定要将所有人脸添加到该人脸库嘛？', '确定', {
        confirmButtonText: '确定',
        type: 'warning',
        customClass: 'alertBox'
      }).then(() => {
        addFaceInfo(
          this.facesetInfo.facesetId,
          'addAll',
          this.facesetInfo.category
        )
          .then(res => {
            this.addTableInfo.multipleSelection = []
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.getDeleteFaceList('find', this.facesetInfo.facesetId)
            this.getAddFaceList()
            this.$refs.addFaceTable.clearSelection()
          })
          .catch(() => {})
      })
    },

    // 添加人脸-分页
    sizeChangeAdd(num) {
      this.getAddFaceList(
        'add',
        this.facesetInfo.facesetId,
        this.searchfaceName,
        10,
        num
      )
    },

    // 添加人脸-提交
    submitFaceListAdd() {
      if (this.addTableInfo.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择人员'
        })
      } else {
        const mutiArray = []
        let mutiStr = ''
        this.addTableInfo.multipleSelection.forEach(val => {
          mutiArray.push(val.userId)
        })
        mutiStr = mutiArray.join(',')
        addFaceInfo(mutiStr, this.facesetInfo.ruleId)
          .then(res => {
            this.addTableInfo.multipleSelection = []
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.getDeleteFaceList('find', this.facesetInfo.facesetId)
            this.getAddFaceList()
            this.$refs.addFaceTable.clearSelection()
          })
          .catch(() => {})
      }
    },

    // 添加全部人脸到人脸库

    // 删除人脸-获取列表
    getDeleteFaceList(
      type = 'find',
      facesetId = this.facesetInfo.ruleId,
      pageSize = 10,
      pageNumber = 1,
      name,
    ) {
      facesetId = this.facesetInfo.ruleId
      return new Promise((resolve, reject) => {
        getFaceList(
          type,
          facesetId,
          pageSize,
          pageNumber,
          name
        )
          .then(res => {
            if (res.data.list.length !== 0) {
              this.deleteTableInfo.currentPage = res.data.pageNumber
              this.deleteTableInfo.tableData = res.data.list
              this.deleteTableInfo.totalPages = res.data.total
              resolve('deleteTableInfo')
            }
          })
          .catch(err => {
            this.deleteTableInfo.tableData = []
            // this.$message.warning('无相关信息')
            reject({ msg: '暂无已有人员数据' })
          })
      })
    },

    // 删除人脸-全选
    handleSelectionChangeDelete(val) {
      this.deleteTableInfo.multipleSelection = val
    },

    // 删除人脸-分页
    sizeChangeDelete(num) {
      this.getDeleteFaceList(
        'find',
        this.facesetInfo.facesetId,
        10,
        num
      )
    },

    // 删除人脸-提交
    submitFaceListDelete() {
      if (this.deleteTableInfo.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择人脸'
        })
      } else {
        const mutiArray = []
        let mutiStr = ''
        this.deleteTableInfo.multipleSelection.forEach(val => {
          mutiArray.push(val.userId)
        })
        mutiStr = mutiArray.join(',')
        deleteFaceInfo(this.facesetInfo.ruleId, mutiStr)
          .then(res => {
            this.deleteTableInfo.multipleSelection = []
            this.$message({
              type: 'success',
              message: '移除成功!'
            })
            this.getDeleteFaceList('find', this.facesetInfo.facesetId)
            this.getAddFaceList()
          })
          .catch(() => {})
      }
    },

    // 添加全部
    removeAll() {
      MessageBox.confirm('您确定要删除该人脸库的所有人脸嘛？', '确定', {
        confirmButtonText: '确定',
        type: 'warning',
        customClass: 'alertBox'
      }).then(() => {
        deleteFaceInfo(this.facesetInfo.facesetId, 'removeAll')
          .then(res => {
            this.deleteTableInfo.multipleSelection = []
            this.$message({
              type: 'success',
              message: '移除成功!'
            })
            this.$emit('delteFaceInfoSuccess')
            this.getDeleteFaceList('find', this.facesetInfo.facesetId)
            this.getAddFaceList()
          })
          .catch(() => {})
      })
    },

    // 关闭
    handleClose() {
      this.tabPosition = 'delete'
      this.addTableInfo = {
        tableData: [],
        multipleSelection: [],
        totalPages: 0
      }
      this.deleteTableInfo = {
        tableData: [],
        multipleSelection: [],
        totalPages: 0
      }
      this.$emit('faceCurdSuccess')
    },

    // 刷新
    handleRefresh() {
      this.searchfaceName = ''
      this.handleSearchFace()
    }
  }
}
</script>

<style lang='scss' scoped>
$primayText: #303133;
$commonText: #606266;
$remainText: #909399;

.searchArea {
  text-align: right;
  width: 95%;
  margin: 0 auto;
}

.faceSortPage {
  min-height: 35px !important;
}
.auth {
  &-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1998;
    background: rgba(0, 0, 0, 0.5);
  }
  &-wrap {
    width: 45%;
    height: 100%;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1999;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.wrap {
  &-header {
    width: 95%;
    height: 30px;
    text-align: left;
    margin: 0 auto;
  }
  &-user {
    width: 95%;
    height: 40px;
    text-align: left;
    margin: 0 auto;
    p {
      color: $commonText;
      font-size: 14px;
    }
  }
  &-userOwnAuth {
    width: 95%;
    margin: 0 auto;
  }
  &-authItem {
    margin: 30px 0 30px 0;
  }
}

.closeBtn {
  position: absolute;
  right: 25px;
  top: 5px;
}

.addTable {
  min-height: calc(100vh - 170px);
  max-height: calc(100vh - 170px);
  overflow-y: auto;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.addFace-footer {
  position: absolute;
  left: 23%;
  bottom: 8%;
  opacity: 0.9;
  transform: translateX(50%);
}

.addTable::-webkit-scrollbar {
  width: 8px;
}

.addTable::-webkit-scrollbar-track {
  background-color: #fff;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

.addTable::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.3);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

.auth-animateFadeIn {
  animation: fadeIn 0.5s forwards;
}

.slideIn-enter,
.slideIn-leave-to {
  right: -600px;
}

.slideIn-enter-active,
.slideIn-leave-active {
  transition: right 0.5s ease;
}

@keyframes fadeIn {
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>

<style>
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: transparent;
}
</style>

<template>
  <div>
    <Imagelamp :isShow="lampIsShow" @closeModal="lampIsShow = false" :path="lPhotoPath" />
    <Searcharea
      v-model="searchData"
      :visible="false"
      @handleSearch="handleSearch"
      @refreshData="refreshData"
      placeholder="请输入搜索内容"
    >
      <div slot="extraArea" style="white-space:nowrap">
        <el-input v-model="searchName" placeholder="请输入用户名称" style="width:200px"></el-input>
        <span slot="eventArea">
          <!-- <el-button  icon="el-icon-plus" @click="handleUploadImage">上传照片查询</el-button> -->
        </span>
      </div>
    </Searcharea>
    <el-table
      v-loading="isLoading"
      class="snapTable"
      height="250px"
      :data="tableData"
      ref="snapTableRef"
      style="width: 100%"
    >
      <el-table-column label="抓拍人脸" align="center" width="180">
        <template slot-scope="scope">
          <img
            :src="scope.row.rPhoto"
            alt="图片"
            style="width:100px;height:100px;cursor:pointer"
            @click="handleLoogBigPic(scope.row.lPhoto)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="similarity" align="center" label="相似度">
        <template slot-scope="scope">
          <el-progress
            type="circle"
            :width="70"
            :percentage="similarityPercent(scope.row.similarity)"
            v-if="scope.row.name != '陌生人'"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="标准人脸" align="center" width="180">
        <template slot-scope="scope">
          <img
            :src="
              scope.row.uPhoto
                ? scope.row.uPhoto
                : require('@/assets/icons/defaultuser.jpg')
            "
            alt="暂无图片"
            style="width:100px;height:100px"
            v-if="scope.row.name != '陌生人'"
          />
          <img
            :src="require('@/assets/icons/defaultuser.jpg')"
            alt="暂无图片"
            style="width:100px;height:100px"
            v-if="scope.row.name == '陌生人'"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column prop="category" align="center" label="所属名单">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.category === 0">白名单</el-tag>
          <el-tag v-if="scope.row.category === 1" type="success">黑名单</el-tag>
          <el-tag v-if="scope.row.category === 2" type="info">陌生人</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="webcamName" label="抓拍位置" align="center" width="180"></el-table-column>

      <el-table-column align="center" label="抓拍时间">
        <template slot-scope="scope">
          {{
          scope.row.createDate.time | formatTime
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="人脸库">
        <template slot-scope="scope">{{ scope.row.facesetName }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            v-if="scope.row.category === 2"
            @click="addFace(scope.row.rPhoto)"
          >录入人脸</el-button>
          <el-button type="primary" size="mini" @click="handleFaceTrajectory(scope.row)">人脸轨迹</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Sortpage
      :totalPages="totalPages"
      @sizeChange="handleSizeChange"
      :currentPage="currentPage"
      :sortShow="sortShow"
    />
    <Findsearch
      @submitSuccess="handleUploadSuccess"
      @closeModal="uploadVisible = false"
      :dialogVisible="uploadVisible"
    />
    <Facetrace
      :authDrawerVisible="faceTraceDrawerVisible"
      @closeModal="faceTraceDrawerVisible = false"
      ref="faceTraceDrawerRef"
    />
    <!-- 将陌生人 添加到 人脸库 -->
    <Addface
      @closeModal="modalAddFaceShow = false"
      @submitSuccess="handleFaceSuccess('ADD_FACE_SUCCESS')"
      :dialogVisible="modalAddFaceShow"
      ref="addFacerefs"
    />
  </div>
</template>

<script>
import { getSnapShotList } from "@/api/snapshot";
// import { getWebCamList } from "@/api/webcam";
import { computedFormatTime } from "@/utils/tools";
import sortmix from "@/utils/sortmix";

import Searcharea from "@/components/searcharea/searcharea";
import Sortpage from "@/components/sortpage/sortpage";
import Imagelamp from "@/components/imglamp/imglamp";
import Facetrace from "@/components/facetrace/facetrace";
import Addface from "./addface/addface"; // 新增人脸信息

import Findsearch from "./searchtrace/searchtrace";

export default {
  mixins: [sortmix],
  components: {
    Searcharea,
    Sortpage,
    Imagelamp,
    Findsearch,
    Facetrace,
    Addface
  },
  data() {
    return {
      lampIsShow: false,
      uploadVisible: false,
      faceTraceDrawerVisible: false,
      modalAddFaceShow: false, // 新增人脸信息
      searchDate: [],
      searchName: "",
      lPhotoPath: "",
      tableData: [],
      camList: [],
      nameListOptions: [
        {
          id: "",
          name: "人脸名单(全部)"
        },
        {
          id: "0",
          name: "白名单"
        },
        {
          id: "1",
          name: "黑名单"
        },
        {
          id: "2",
          name: "陌生人"
        }
      ],
      faceId: "",
      searchData: "",
      totalPages: 0,
      camSelectStr: "",
      nameSelectStr: "",
      routerId: ""
    };
  },

  mounted() {
    this.__getWebcamList("", 100);
    this.routerId = this.$route.query.id;
    // console.log('快捷跳转——陌生人人脸')
    if (this.routerId == "index") {
      this.nameSelectStr = "2"; //陌生人脸列表
    }
    this.__Init(
      10,
      1,
      this.nameSelectStr,
      this.camSelectStr,
      "",
      this.searchDate[0],
      this.searchDate[1],
      this.searchName
    );
  },

  watch: {},

  filters: {
    formatTime(val) {
      return computedFormatTime(val);
    },
    similarityPercent(val) {
      let beforeDot = parseFloat(val)
        .toFixed(4)
        .split(".")[1]
        .slice(0, 2);
      let afterDot = parseFloat(val)
        .toFixed(4)
        .split(".")[1]
        .slice(2, 4);
      return beforeDot + "." + afterDot;
    }
  },

  methods: {
    similarityPercent(val) {
      let beforeDot = parseFloat(val)
        .toFixed(4)
        .split(".")[1]
        .slice(0, 2);
      let afterDot = parseFloat(val)
        .toFixed(4)
        .split(".")[1]
        .slice(2, 4);
      return Number(beforeDot + "." + afterDot);
    },
    __Init(
      pageSize = 10,
      pageNumber = this.pageNumber,
      category,
      webcamId,
      faceId = this.faceId,
      startDate = "",
      endDate = "",
      name = this.searchName
    ) {
      this.isLoading = true;
      getSnapShotList(
        pageSize,
        pageNumber,
        category,
        webcamId,
        faceId,
        startDate,
        endDate,
        name
      )
        .then(res => {
          this.tableData = res.data.List;
          this.pageNumber = res.data.pageNumber;
          this.totalPages = res.data.total;
          this.$nextTick(() => {
            this.$message({ type: "success", message: "获取成功" });
            this.handleResetSort();
          });
        })
        .catch(() => {
          this.tableData = [];
          this.isLoading = false;
          this.totalPages = 0;
        });
    },

    // 根据照片查找
    handleUploadImage() {
      this.uploadVisible = true;
    },

    // 上传成功
    handleUploadSuccess(faceId) {
      this.faceId = faceId;
      this.__Init();
      this.uploadVisible = false;
    },

    // 分页
    handleSizeChange(num) {
      this.pageNumber = num;
      document.querySelectorAll(".el-table__body-wrapper")[0].scrollTop = 0;
      this.__Init(
        10,
        num,
        this.nameSelectStr,
        this.camSelectStr,
        this.faceId,
        this.searchDate[0],
        this.searchDate[1]
      );
    },

    // 搜索
    handleSearch() {
      if (this.searchDate == null) {
        this.searchDate = [];
      }
      this.__Init(
        10,
        1,
        this.nameSelectStr,
        this.camSelectStr,
        "",
        this.searchDate[0],
        this.searchDate[1],
        this.searchName
      );
    },

    // 获取摄像头列表
    __getWebcamList(name, number) {
      getWebCamList(name, number)
        .then(res => {
          this.camList = res.data.List;
        })
        .catch(() => {});
    },

    // 刷新
    refreshData() {
      this.faceId = "";
      this.camSelectStr = "";
      this.nameSelectStr = "";
      this.searchDate = [];
      this.endDate = "";
      this.searchName = "";
      this.__Init(10, 1);
    },

    // 人脸轨迹
    handleFaceTrajectory(res) {
      this.faceTraceDrawerVisible = true;
      this.$refs.faceTraceDrawerRef.getFaceTraceList(res.faceId);
    },

    // 查看大图
    handleLoogBigPic(path) {
      this.lampIsShow = true;
      this.lPhotoPath = path;
    },
    // 人脸信息反馈
    handleFaceSuccess(modalType) {
      this.__Init(
        10,
        1,
        this.nameSelectStr,
        this.camSelectStr,
        "",
        this.searchDate[0],
        this.searchDate[1],
        this.searchName
      );
      switch (modalType) {
        case "ADD_FACE_SUCCESS":
          this.modalAddFaceShow = false;
          this.modalAddPhotoShow = false;
          break;
        default:
          break;
      }
    },
    // 点击 弹出添加人脸框
    addFace(url) {
      this.modalAddFaceShow = true;
      this.$refs.addFacerefs.getFaceUrl(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.snapTable {
  max-height: calc(100vh - 180px);
  min-height: calc(100vh - 180px);
  overflow-y: auto;
}
</style>

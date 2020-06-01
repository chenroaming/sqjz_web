<template>
  <div>
    <Lamp :isShow="isShow" @closeModal="isShow=false" :path="path"></Lamp>
    <div class='backToSnap'>
      <el-button icon="el-icon-arrow-left" size="mini" @click="handleBackToSnap" circle=""></el-button>
    </div>
    <el-timeline>
      <el-timeline-item :timestamp=" item.createDate.time | formatTime " placement="top" v-for="(item, index) in tableData" :key="index">
        <el-card>
          <img style="cursor:pointer" :src="item.rPhoto" alt="" @click="handleLookLphoto(item.lPhoto)">
          <h4>{{ item.name }} （{{ item.gender === '0'? '男' : '女'}}）</h4>
          <p>相似度：{{ item.similarity | similarityPercent }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getSnapShotList } from '@/api/snapshot';
import { getWebCamList } from '@/api/webcam';
import { computedFormatTime } from '@/utils/tools';
import Lamp from "@/components/imglamp/imglamp";
export default {
  components: {
    Lamp,
  },

  data () {
    return {
      isShow: false,
      path: '',
      tableData: [],
      camList: [],
      nameListOptions:[
        {
          id:'',
          name:'全部',
        },
        {
          id: '0',
          name:'白名单',
        },
        {
          id: '1',
          name:'黑名单',
        },
        {
          id: '2',
          name:'陌生人',
        },
      ],
      faceId:'',
      totalPages: 0,
    }
  },

  mounted () {
    this.__Init(10, 1, '', '', this.$route.params.faceId);
  },

  filters: {
    formatTime (val) {
      return computedFormatTime(val);
    },

    // 相似度匹配
    similarityPercent (val) {
      let beforeDot = val.toFixed(4).split('.')[1].slice(0,2);
      let afterDot = val.toFixed(4).split('.')[1].slice(2,4);
      return beforeDot + '.' + afterDot + '%';
    }
  },

  methods: {
    __Init (pageSize = 10, pageNumber = 1 , category, webcamId, faceId = '') {
      getSnapShotList(pageSize, pageNumber, category, webcamId, faceId)
      .then(res=>{
        this.$message({type: 'success', message: '获取成功'});
        this.tableData = res.data.List;
        this.totalPages = res.data.total;
      }).catch(()=>{
        this.tableData = [];
      });
    },

    // 返回抓拍记录管理
    handleBackToSnap () {
      this.$router.push({name:'snapshotmanger'});
    },

    // 查看大图
    handleLookLphoto (path) {
      this.path = path;
      this.isShow = true;
    }
  }
}
</script>

<style lang="scss" scoped>
  .backToSnap {
    width: 96%;
    margin: 20px auto;
    height: 30px;
    text-align: left;
    padding-left: 10px;

  }
</style>

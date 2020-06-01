<template>
    <div class="pm-distribution">
        <Imagelamp :isShow="lampIsShow" @closeModal="lampIsShow=false" :path="lPhotoPath"/>
        <h3 class="title">抓拍地图分布</h3>
        <div class="container" id="container" :style="{height:containerHeight}">
            <div class="left">
                <div style="width:100%">
                    <el-input placeholder="请输入您要搜索的人名" v-model="searchName">
                        <template slot="prepend">姓名</template>
                    </el-input>
                    <div class="dateBox">
                        <div class="el-input-group__prepend">日期</div>
                        <el-date-picker
                        v-model="searchDate"
                        type="date"
                        placeholder="请选择查询日期（默认当天）"
                        style="flex:1"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                    <div style="text-align:center;margin-top:5px;">
                        <el-button size="small" round style="width:60%" type="primary" @click="searchMan">搜  索</el-button>
                    </div>
                </div>
                
                <div class="list" :style="{height:leftHeight}">
                    
                    <div class="list-context">
                        <p>共 <span style="color:red;font-weight:bold"> {{markers.length}} </span> 个抓拍记录</p>
                        <div ref="box" class="list-scroll bmr-y-scroll" :style="{height:leftHeight}">
                            <!-- 项目列表-->
                            <div class="listItemDIV">
                          <div class="row" v-for="(marker,index) of markers" :key="marker.id+index" @click="lookDetail(marker,'left',index)" :class="{active: activeName == marker.id+index}">
                              <div
                                 class="head-title" v-text="marker.name" :title="marker.name"></div>
                              <div class="row-content">
                                  <span class="item"><i class="iconfont nhjc-dianli electricity"></i>抓拍相机：{{marker.webcamName}}</span>
                                  <span class="item"><i class="iconfont nhjc-shui water"></i>抓拍时间：{{ marker.time.time | formatTime }}</span>
                              </div>
                          </div>
                          <div style="clear:both;"></div>
                            </div>
                      </div>
                    </div>
                </div>
            </div>
            
            <div class="right-context" id="right-context">
                <baidu-map style="width:100%;height:100%" class="map" ak="DvoyV7vtMIgqmpM0UM7Xg0Yd0MyUyvi8" :zoom="map.zoom" :center="{lng: map.center.lng, lat: map.center.lat}" @ready="handler" id="mapBox">
                      <!--比例尺控件-->
                      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
                      <!--缩放控件-->
                      <!-- <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" ></bm-navigation> -->
                      <!--聚合动态添加的点坐标-->
                      <bm-marker-clusterer :averageCenter="true">
                          <bm-marker v-for="(marker,index) in markers" :key="marker.id+index" :position="{lng: marker.lng, lat: marker.lat}" @click="lookDetail(marker,index)">
                              <bm-label :content="index+1+''" :labelStyle="labelStyle" :offset="offset"/>                        
                          </bm-marker>
                      </bm-marker-clusterer>
                      <!--信息窗体-->
                      <bm-info-window :position="{lng: infoWindow.info.lng, lat: infoWindow.info.lat}" :title="infoWindow.info.name" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen" >
                          <!-- <p><span class="left" style="font-size:12px">人脸相似度：</span><span class="right" style="font-size:12px">{{infoWindow.info.like}}</span></p> -->
                          <p><span class="left" style="font-size:12px">抓拍时间：</span><span class="right" style="font-size:12px">{{ infoWindow.info.time.time | formatTime }}</span></p>
                          <p><span class="left" style="font-size:12px">抓拍相机：</span><span class="right" style="font-size:12px">{{infoWindow.info.webcamName}}</span></p>
                          <p><img class="right" style="width:80px;height:100px;cursor:pointer;" :src="infoWindow.info.rPhoto" @click="handleLoogBigPic(infoWindow.info.lPhoto)"></p>
                          <p><span class="right" style="font-size:12px;cursor:pointer;" @click="handleLoogBigPic(infoWindow.info.lPhoto)">点击可查看抓拍大图</span></p>
                      </bm-info-window>
                  </baidu-map>
            </div>

            
        </div>

        <div class="block nameList" v-show="nameList.length>0">
            <h3 style="width:100%;text-align：center">请选择您要查看的用户</h3>
            <div v-for="(item, num) in nameList" :key="item.faceId" class="nameItem" @click="selectPeople(item.faceId)">
                <p class="demonstration">{{item.name}}</p>
                <div style="text-align:center">
                    <img :src="item.uPhoto">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //百度地图
    import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
    import BmScale from 'vue-baidu-map/components/controls/Scale'
    import BmNavigation from 'vue-baidu-map/components/controls/Navigation'
    import BmMarkerClusterer from  'vue-baidu-map/components/extra/MarkerClusterer'
    import BmMarker from 'vue-baidu-map/components/overlays/Marker'
    import BmLabel from 'vue-baidu-map/components/overlays/Label'
    import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'

    //引入接口
    import { getUserByName,getMapList } from "@/api/map";
    import { computedFormatTime } from "@/utils/tools";
    import Imagelamp from "@/components/imglamp/imglamp";
    export default {
        name: "pm-distribution",
        components: {
            BaiduMap,
            BmScale,
            BmNavigation,
            BmMarkerClusterer,
            BmMarker,
            BmInfoWindow,
            BmLabel,
            Imagelamp
        },
        filters: {
    　　　　Upper: function (value) {
    　　　　　　return parseInt(value)+1;
    　　　　},
            formatTime (val) {
                if (val === null) return '暂未填写';
                return computedFormatTime(val);
            }
    　　},
        data() {
            return {
                mapObj :null,
                lampIsShow:false,
                lPhotoPath:'',
                labelStyle:{color: 'white', fontSize : '12px',border:'none',background:'none'},
                faceId:'',//查看人的人脸ID
                nameList:[],
                offset:{width: 5, height: 3},
                map:{
                    center: {lng: 118.184633,lat:24.493337},//'厦门 - 纵横集团',118.184633,24.493337
                    zoom: 19,
                    mapType:'BMAP_PERSPECTIVE_MAP'
                },
                searchName:'',
                searchDate:'',
                markers:[
                //   {
                //     code:1,//或者id  唯一标识
                //     lng:118.184633,//坐标x轴
                //     lat:24.493337,//坐标y轴
                //     name:'李启峰 （男）',//抓拍人名
                //     webcamName:'ZH工位',//抓拍相机名称
                //     time:'2019-06-21 15:02:33',//抓拍时间
                //     rPhoto: "/all_face/5920101004/face/9e4de899-a353-4747-abc2-7800bb238472863160874516005578.jpg",//抓拍人脸   
                //     like:'88.8%'
                //   },
                ],
                infoWindow: {
                    lng: 0,
                    lat: 0,
                    show: false,
                    info:{
                        lng:118.184673,
                        lat:24.493147,
                        name:'暂未填写',
                        webcamName:'暂未填写',
                        time:'暂未填写',
                        rPhoto: "暂未填写"
                    },
                },
                activeName: '',
                leftHeight:'480px',
                containerHeight:'700px'
            }
        },
        mounted() {
            this.leftHeight=document.body.clientHeight-300+'px';
            this.containerHeight=document.body.clientHeight-150+'px';
        },
        methods: {
            //搜索事件
            searchMan(){
                if(this.searchName == ''){
                    this.$message({type: 'error', message: '请先输入您要搜索的姓名!'});
                    return;
                }
                this.markers = [];
                this.nameList = [];
                this.mapObj.clearOverlays();
                getUserByName(this.searchName)
                .then(res=>{
                    // console.log('根据人名获取的列表！')
                    console.log(res.data.result)
                    if(res.data.count==1){
                        this.faceId = res.data.result[0].faceId;//如果只有一个搜索结果，则直接匹配对应的人脸轨迹
                        this.getMap();
                    }
                    if(res.data.count > 1){
                        this.nameList = res.data.result;
                    }
                    if(res.data.count == 0){
                        this.$message({type: 'error', message: '没有找到相关用户！请输入正确的用户名'});
                    }
                }).catch(()=>{

                })
            },
            infoWindowClose (e) {
                this.infoWindow.show = false
            },
            infoWindowOpen (e) {
                this.infoWindow.show = true
            },
            //查看详情
            lookDetail(data, target,index = ''){
                // console.log('data',data)
                this.infoWindow.show =true;
                this.infoWindow.info=data;
                if(target!='left'){ //点击的是左侧列表项，则不需要滚动
                    this.activeName = data.id + target;
                }
                
                // let This=this;
                //为弹窗口标题添加title
                this.$nextTick(()=>{
                    var win=document.querySelector(".BMap_bubble_title");
                    win.title = this.activeName;
                })
                if(target=='left'){ //点击的是左侧列表项，则不需要滚动
                    this.map.center={lng: data.lng, lat: data.lat};
                    this.map.zoom = 19;
                    this.activeName = data.id + index;
                    return;
                }
                //滚动到指定元素位置
                this.$nextTick(()=>{
                    var obj=document.querySelector(".active");
                    var scrollTop=obj.offsetTop;
                    this.$refs.box.scrollTop=scrollTop-180;
                })
            },
            //地图初始化
            handler ({BMap, map}) {
                console.log(BMap, map)
                this.mapObj = map;
            },
            //选择查看的人
            selectPeople(faceId){
                this.faceId = faceId;
                this.nameList = [];
                this.getMap();
            },
            //搜索地图记录
            getMap(){
                getMapList(this.faceId,this.searchDate)
                .then(res=>{
                    if(res.data.result[0].lng !=null && res.data.result[0].lat != null){
                        this.map.center.lng = res.data.result[0].lng;
                        this.map.center.lat = res.data.result[0].lat;
                        // console.log('重新标记地图中心！')
                    }

                    this.markers = res.data.result;
                    if(this.markers.length>1){
                        var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                            scale: 0.6,//图标缩放大小
                            strokeColor:'#fff',//设置矢量图标的线填充颜色
                            strokeWeight: '2',//设置线宽
                        });
                        var icons = new BMap.IconSequence(sy, '10', '30');
                        // 创建polyline对象
                        var pois = [
                            // new BMap.Point(118.184633, 24.493337)
                        ];

                        this.markers.forEach( item => {
                            let aObj = new BMap.Point(item.lng, item.lat);
                            pois.push(aObj);
                        })
                        // console.log(pois)
                        var polyline =new BMap.Polyline(pois, {
                            enableEditing: false,//是否启用线编辑，默认为false
                            enableClicking: true,//是否响应点击事件，默认为true
                            icons:[icons],
                            strokeWeight:'8',//折线的宽度，以像素为单位
                            strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                            strokeColor:"#18a45b" //折线颜色
                        });
                        // var map = new BMap.Map("mapBox");
                        this.mapObj.addOverlay(polyline);          //增加折线
                    }
                    
                }).catch(()=>{

                })
            },
            // 查看大图
            handleLoogBigPic (path) {
                this.lampIsShow = true;
                this.lPhotoPath = path;
                // console.log('111')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-input-group__append, .el-input-group__prepend {
        background-color: #f5f7fa;
        color: #909399;
        vertical-align: middle;
        display: table-cell;
        position: relative;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        padding: 0 20px;
        width: 1px;
        white-space: nowrap;
        height: 39px;
        font-size: 14px;
        width: 70px;
        line-height: 38px
    }
    $bgBlueColor: #1881bf;
    h3.title {
        box-sizing: border-box;
        height: 34px;
        line-height: 34px;
        margin: 5px;
        font-size: 16px;
        font-weight: 600;
        padding: 0 0 0 30px;
        border: 1px #E5EEF3 solid;
        color: #2274A4;
        background: #F5F9F9;
        width: 100%;
        text-align: center;
    }
    .container {
        margin: 0 auto;
        margin-left: 10px;
        min-width: 1366px;
        padding: 0px;
        min-height: 100%;
        display: flex;
        flex-direction: row;
        .left {
            width: 320px;
            // float: left;
            .header {
                width: 300px;
                clear: left;
                height: 34px;
                line-height: 34px;
                color: black;
                background:white;
            }
            .top {
                height: 70px;
                padding: 8px 5px 12px 5px;
            }
        }
        .right-context {
            // float: left;
            flex: 1
        }
        .item {
            margin: 5px;
            height: 28px;
            line-height: 28px;
            .electricity{
                color: #FFD670;
            }
            .water{
                color:rgb(132, 165, 175);
            }
            .air{
                color:#F39795;
            }
            .iconfont{
                font-size: 22px;
            }
        }
        .query-submit {
            width: 90px;
            border-radius: 28px;
            background: $bgBlueColor;
            color: #fff;
            text-align: center;
            cursor: pointer;
        }
        .list{
            .item{
                width: 93px;
                height: 30px;
                line-height: 30px;
                display: block;
            }
            .item.fl{
                float: left;
            }
            .list-context{
                border-radius:5px;margin-top:10px;background:white;
                border: 2px #DCDFE6 solid;
                .list-scroll{
                    margin-top:10px;overflow-y:auto;min-height:537px;overflow-x: hidden;
                    .row{
                        float:left;width:320px;
                        cursor: pointer;
                        .head-title{
                            overflow: hidden;text-overflow: ellipsis;white-space: nowrap;font-size:16px;color:#1781BF;font-weight:400; padding-left: 20px;
                            height: 30px;
                            line-height: 30px;
                        }
                        .row-content{
                            overflow: hidden;text-overflow: ellipsis;white-space: nowrap;padding-bottom:10px;font-size:12px;color:rgb(128, 128, 128);
                            border-bottom: 1px solid #eee; padding-left: 10px;
                        }
                    }
                    .row.active{
                        background-color: #CFDDF3;
                    }
                }
            }
        }
        .map{
           min-width: 800px; width:1000px;height:710px;float:left;background:white;border-radius:5px;margin-left:10px;
            .right{
               text-align: left;
            }
            .left{
                width: 100px;
            }
        }

    }
</style>
<style lang="scss">
    .pm-distribution{
        .BMap_bubble_title {
            color: #2DB7F5 !important;
            font-size: 16px;
            font-weight: 400;
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            width: 220px !important;
        }
    }
    .dateBox{
        display: flex;
        margin-top: 5px;
    }
    .list-context p{
        margin: 0;
        height: 30px;
        line-height: 30px;
        background-color: #CFDDF3;
        padding-left: 15px;
        font-weight: bold
    }
    .nameList{
        width: 50%;
        height: 50%;
        background-color: white;
        position: fixed;
        left: 30%;
        top: 20%;
        display: flex;
        justify-content: space-around;
        // align-items: center;
        flex-wrap:wrap;
        overflow-y: auto
    }
    .nameList h3{
        text-align: center;
        height: 50px;
        line-height: 50px;
        margin: 5px;
    }
    .nameItem{
        // flex: 1;
        background-color: #CFDDF3;
        width: 20%;
        height: 240px;
        cursor: pointer;
    }
    .nameItem p{
        text-align: center;
        font-weight: bold
    }
    .nameItem img{
        height: 190px;
        width: 150px;
        // width: 100%
    }
</style>
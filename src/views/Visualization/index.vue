<template>
  <div class="main_all">
    <div class="login-container">
      <div class="top_box">
        <div class="top_box_left">
          <div class="userinfo">
            <div class="user_cion"/>
            <h3>欢迎您，{{ username }}</h3>
          </div>
        </div>
        <div class="top_box_right" @click="gotourl">
          <div class="top_ht_left">
            <h3>{{ Datavalue }}</h3>
          </div>
          <div class="top_ht">
            <h3>后台管理</h3>
          </div>
        </div>
      </div>
      <div class="main_box">
        <div class="main_box_lr">
          <div class="char_box">
            <div style="height:100%;">
              <div class="char_box_title">
                <h3>实时统计</h3>
              </div>

              <div class="tj1_mainbox">
                <div class="tjbox">
                  <div class="tjbox_left">
                    <div class="tjbox_left_s">
                      <h2>{{ userNumberCount.totalNumber }}</h2>
                      <p style="margin:0;color:#fff">矫正总数</p>
                    </div>
                  </div>
                </div>

                <div class="tjbox" style="float: right;">
                  <div class="tjbox_right">
                    <div class="tjbox_right_lr" style="float: left;">
                      <h4>
                        入矫
                        <i class="el-icon-caret-bottom" style="color:red"/>
                      </h4>
                      <h1>{{ userNumberCount.correctedNumber }}</h1>
                    </div>
                    <div class="tjbox_right_lr" style="float: right;">
                      <h4>
                        解矫
                        <i class="el-icon-caret-top" style="color:green"/>
                      </h4>
                      <h1>0</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="char_box" style="height:20%">
            <div style="height:100%;">
              <div class="char_box_title">
                <h3>今日报告统计</h3>
              </div>

              <div class="today_port_main">
                <div
                  v-if="
                    clockCount.completewidth != '0%' &&
                      clockCount.uncompletedwidth != '0%'
                  "
                  class="today_port_main_s"
                >
                  <div :style="[{ width: clockCount.completewidth }]" class="today_port_main_s_l">
                    <h3>{{ clockCount.complete }}</h3>
                  </div>
                  <div
                    :style="[{ width: clockCount.uncompletedwidth }]"
                    class="today_port_main_s_r"
                  >
                    <h3>{{ clockCount.uncompleted }}</h3>
                  </div>
                </div>

                <div
                  v-if="
                    clockCount.completewidth == '0%' &&
                      clockCount.uncompletedwidth == '100%'
                  "
                  class="today_port_main_s"
                >
                  <div
                    :style="[{ width: clockCount.uncompletedwidth }]"
                    class="today_port_main_s_r"
                    style="border-radius:30px"
                  >
                    <h3>{{ clockCount.uncompleted }}</h3>
                  </div>
                </div>

                <div
                  v-if="
                    clockCount.completewidth == '100%' &&
                      clockCount.uncompletedwidth == '0%'
                  "
                  class="today_port_main_s"
                >
                  <div
                    :style="[{ width: clockCount.completewidth }]"
                    class="today_port_main_s_r"
                    style="border-radius:30px"
                  >
                    <h3>{{ clockCount.complete }}</h3>
                  </div>
                </div>

                <div
                  v-if="
                    clockCount.completewidth == '0%' &&
                      clockCount.uncompletedwidth == '100%'
                  "
                  class="today_port_main_x"
                >
                  <h3 style="color:#3859ff;position: relative;left: 5%">未报告</h3>
                </div>

                <div
                  v-if="
                    clockCount.completewidth == '100%' &&
                      clockCount.uncompletedwidth == '0%'
                  "
                  class="today_port_main_x"
                >
                  <h3 style="color:#05dbb0;position: relative;left: 5%">已报告</h3>
                </div>

                <div
                  v-if="
                    clockCount.completewidth != '0%' &&
                      clockCount.uncompletedwidth != '0%'
                  "
                  class="today_port_main_x"
                >
                  <h3 style="color:#05dbb0;position: relative;left: 5%">已报告</h3>
                  <h3
                    :style="[{ left: clockCount.uncompletedtext }]"
                    style="color:#3859ff;position: relative;"
                  >未报告</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="char_box" style="height:55%">
            <div style="height:100%;">
              <div class="char_box_title" style="height: 10%;">
                <h3>区/县人数分布</h3>
              </div>
              <div class="qxrs_char">
                <ve-pie
                  :data="areaCountdata"
                  :settings="areaCountdataSettings"
                  :extend="qxrs_char"
                  height="350px"
                  width="350px"
                />
              </div>
              <div class="char_box_title" style="height: 10%;padding-top:0;">
                <h3>矫正类型统计</h3>
              </div>
              <div class="jjlx">
                <ve-pie
                  :data="userTypeCountdata"
                  :settings="chartSettings2"
                  :extend="qxrs_char"
                  height="150px"
                  width="350px"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- :center="areaName" -->
        <div class="main_box_center">
          <div class="map_box" style="padding: 0px 5px 5px 5px;">
            <div style="width: 30%;height: 70px;">
              <span class="statusItem">正常：{{ normal }}</span>
              <span class="statusItem">异常：{{ deviate }}</span>
              <span class="statusItem">离线：{{ missing }}</span>
            </div>
            <baidu-map
              :center="areaName"
              :scroll-wheel-zoom="true"
              :map-style="mapStyle"
              :zoom="mapzoom"
              ak="DvoyV7vtMIgqmpM0UM7Xg0Yd0MyUyvi8"
              style="width:100%;height:88%;"
            >
              <bm-marker
                v-for="(item, i) in MapPeopleLocationArr"
                :key="i"
                :position="item.location"
                :dragging="false"
                :icon="item.iconobj"
                animation="BMAP_ANIMATION_BOUNCE"
                @click="showmarkerinfo(item)"
              >
                <bm-label :content="item.name" :offset="{ width: -5, height: 20 }" />
              </bm-marker>

              <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"/>
              <bm-map-type
                :map-types="['BMAP_SATELLITE_MAP', 'BMAP_NORMAL_MAP']"
                anchor="BMAP_ANCHOR_TOP_LEFT"
              />
              <bm-geolocation
                :show-address-bar="true"
                :auto-location="true"
                anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
              />
            </baidu-map>
            <!--  -->
          </div>

          <div class="line_box" style="height: 28%;">
            <div style="height:100%;">
              <div class="char_box_title">
                <h3>近7天违规预警趋势</h3>
              </div>
              <div>
                <ve-line
                  :data="warningCountdata"
                  :settings="chartSettings"
                  :extend="chartExtend"
                  height="195px"
                  width="900px"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="main_box_lr" style="vertical-align: top;">
          <div class="char_box">
            <div style="height:100%;">
              <div class="char_box_title">
                <h3>近7天报告完成度趋势</h3>
              </div>
              <div>
                <ve-line
                  :data="clockCountdata"
                  :settings="chartSettings"
                  :extend="chartExtend2"
                  height="215px"
                  width="350px"
                />
              </div>
            </div>
          </div>
          <div class="char_box">
            <div style="height:100%;">
              <div class="char_box_title">
                <h3>矫正对象年龄分部比例</h3>
              </div>
              <ve-pie
                :data="ageCountdata"
                :settings="ageCountdataSettings"
                :extend="qxrs_char"
                height="150px"
                width="350px"
              />
            </div>
          </div>
          <div class="char_box" style="height: 45%;">
            <div style="height:100%;">
              <div class="char_box_title" style="height: 15%;">
                <h3>实时预警消息</h3>
              </div>

              <div v-if="warningList.length == 0" class="char_box_main">
                <h4>暂无预警信息</h4>
              </div>
              <marquee
                v-if="warningList.length != 0"
                onmouseout="this.start()"
                onmouseover="this.stop()"
                class="char_box_main2"
                behavior="scroll"
                direction="up"
                scrolldelay="300"
              >
                <el-popover
                  v-for="(item, key) in warningList"
                  :key="key"
                  :title="item.type"
                  :content="'【'+item.name+'】'+item.time"
                  placement="top-start"
                  width="200"
                  trigger="hover"
                >
                  <div slot="reference" class="char_box_list_box" @click="show_warn_info(item)">
                    <div class="yjicon"/>
                    <div class="yjmainbox">【{{ item.name }}】 {{ item.time }}</div>
                    <div class="yjrightbox">{{ item.type }}</div>
                  </div>
                </el-popover>
              </marquee>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-if="userobj!=''" :visible.sync="dialogVisible" title="人员详情" width="30%">
      <div style="width: 100%; height: 100%;overflow: hidden;">
        <div style="width: 40%; height: 100%;float:left">
          <img :src="userobj.picPath" style="width: 200px; height: 200px" >
        </div>
        <div style="width: 60%; height: 100%;float:right">
          <div style="margin:10px">
            <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
            {{ userobj.name }}
          </div>

          <div style="margin:10px">
            <span>所在经度：</span>
            {{ userobj.location.lng }}
          </div>

          <div style="margin:10px">
            <span>所在纬度：</span>
            {{ userobj.location.lat }}
          </div>

          <div style="margin:10px">
            <span>所在位置：</span>
            {{ userobj.address }}
          </div>

          <div style="margin:10px">
            <span>当前状态：</span>
            <span v-if="userobj.iconobj.type==0" style="color:green;">正常</span>
            <span v-if="userobj.iconobj.type==1" style="color:red;">位置偏离</span>
            <span v-if="userobj.iconobj.type==2" style="color:red;">失联</span>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="getCommunityuser">矫正电子档案</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/utils/mixins'
import {
  BmLabel,
  BmNavigation,
  BmGeolocation,
  BmMapType,
  BaiduMap,
  BmControl,
  BmView,
  BmAutoComplete,
  BmLocalSearch,
  BmInfoWindow,
  BmMarker
} from 'vue-baidu-map'
import {
  GetPelpleLoacion,
  Visualizationlogin,
  userBasicInfoCount,
  userSupervisionInfoCount
} from '@/api/Visualization'
import { getUserDetail } from '@/api/user'
export default {
  components: {
    BmLabel,
    BmGeolocation,
    BmMapType,
    BmNavigation,
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmInfoWindow,
    BmLocalSearch,
    BmMarker
  },
  mixins: [mixin],
  data() {
    this.chartSettings = {
      area: true,
      scale: [false, false],
      labelMap: {
        number: '预警数',
        uncompleted: '未报告人数',
        complete: '已报告人数'
      }
    }
    this.chartSettings2 = {
      radius: 50,
      offsetY: 80
    }
    this.areaCountdataSettings = {
      radius: 50,
      offsetY: 80
    }
    this.ageCountdataSettings = {
      radius: 50,
      offsetY: 80
    }

    this.toolbox = {
      feature: {
        magicType: {
          type: ['line', 'bar']
        },
        saveAsImage: {}
      }
    }
    this.colors = ['#06b70b']
    return {
      normal: 0,
      deviate: 0,
      missing: 0,
      dialogVisible: false,
      userobj: '',
      areaName: '福建',
      mapzoom: 8,
      communityId: '',
      t: null,
      // WebSocket相关参数
      path: '',
      socket: '',
      setIntervalWesocketPush: null,
      // ---------------------
      Datavalue: '',
      username: '测试人员',
      // 页面统计数据
      // 当日基础统计
      userNumberCount: {
        totalNumber: 0,
        correctedNumber: 0
      },
      warningList: [],
      // 当日报告统计
      clockCount: {
        complete: 0,
        uncompleted: 0,
        completewidth: '50%',
        uncompletedwidth: '50%',
        uncompletedtext: '40%'
      },
      // 矫正对象区县分部
      areaCountdata: {
        columns: ['type', 'number'],
        rows: [{ type: '暂无数据', number: 1 }]
      },
      // 矫正对象类型统计
      userTypeCountdata: {
        columns: ['type', 'number'],
        rows: [{ type: '暂无数据', number: 1 }]
      },
      // 矫正对象年龄统计
      ageCountdata: {
        columns: ['type', 'number'],
        rows: [{ type: '暂无数据', number: 1 }]
      },
      // 近7天每日预警统计
      warningCountdata: {
        columns: ['date', 'number'],
        rows: [{ date: '暂无数据', number: 0 }]
      },
      // 近7天每日报告统计
      clockCountdata: {
        columns: ['date', 'uncompleted', 'complete'],
        rows: [{ date: '暂无数据', uncompleted: 0, complete: 0 }]
      },
      MapPeopleLocationArr: [],
      keyword: '',
      mapStyle: {
        style: 'midnight'
        // styleJson: [
        //   {
        //     featureType: "all",
        //     elementType: "geometry",
        //     stylers: {
        //       hue: "#1a488d",
        //       saturation: 89
        //     }
        //   },
        //   {
        //     featureType: "water",
        //     elementType: "all",
        //     stylers: {
        //       color: "#1a488d"
        //     }
        //   }
        // ]
      },
      // center: { lng: 118.184633, lat: 24.493337 },
      // zoom: 19,
      mapObj: '',
      qxrs_char: {
        legend: {
          show: false
        },
        color: ['#ffb422', '#df506b', '#05dbb0']
      },

      chartExtend: {
        series: {
          // xAxisType: "value",
          label: {
            normal: {
              show: true,
              color: '#8a9ecf',
              fontSize: 10
            }
          },
          symbolSize: 5,
          color: ['#ffb422']
        },
        legend: {
          show: false
        },
        grid: {
          y: 20,
          y2: 50,
          left: 30,
          containLabel: true
        },
        xAxis: {
          axisLabel: {
            textStyle: {
              color: '#8a9ecf',
              fontSize: 10
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#123a79'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#8a9ecf'
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: '#8a9ecf',
              fontSize: 10
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#123a79'
            }
          },
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#8a9ecf'
            }
          }
        }
      },
      chartExtend2: {
        series: {
          // xAxisType: "value",
          label: {
            normal: {
              show: true,
              color: '#4ff8f9',
              fontSize: 10
            }
          },
          symbolSize: 5
          // color: ["#4ff8f9"]
        },
        legend: {
          show: false
        },
        grid: {
          y: 20,
          y2: 50,
          left: 30,
          containLabel: true
        },
        xAxis: {
          axisLabel: {
            textStyle: {
              color: '#8a9ecf',
              fontSize: 10
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#123a79'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#8a9ecf'
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: '#8a9ecf',
              fontSize: 10
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#123a79'
            }
          },
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#8a9ecf'
            }
          }
        }
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.login()
    var aData = new Date()

    var self = this
    setInterval(function() {
      self.startTime()
    }, 500) // 1000为1秒钟
  },
  methods: {
    showmarkerinfo(val) {
      // console.log(val);
      if (val) {
        this.userobj = val
        this.dialogVisible = true
      } else {
        this.$message.error('请重新选择人员')
      }
    },
    show_warn_info(val) {
      console.log(val)
    },
    gotourl() {
      // window.location.href = "https://www.ecorrect.cn";
      this.$router.push({ path: '/' })
    },
    scroll() {},
    startTime() {
      var today = new Date()
      var n = today.getFullYear()
      var y = today.getMonth() + 1
      var r = today.getDate()
      var h = today.getHours()
      var m = today.getMinutes()
      var s = today.getSeconds()
      m = this.checkTime(m)
      s = this.checkTime(s)
      this.Datavalue = n + '年' + y + '月' + r + '日' + h + ':' + m + ':' + s
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    WebSocketinit: function(id) {
      this.path =
        'wss://www.ecorrect.cn/community_correction/webClass/ws.jhtml/' + id
      console.log(this.path)
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function() {
      console.log('socket连接成功')
      this.sendPing()
    },
    error: function() {
      console.log('连接错误')
      clearInterval(this.setIntervalWesocketPush)
      this.socket.close()
      // this.WebSocketinit(); //重连
    },
    getMessage: function(e) {
      const msg = JSON.parse(e.data)
      if (msg.messageType == 'warning') {
        console.log(msg)
        const h = this.$createElement

        this.$notify({
          title: '预警消息',
          message: h('i', { style: 'color: teal' }, msg.text),
          type: 'warning'
        })

        const obj = {
          name: msg.name,
          time: msg.time,
          type: msg.title
        }
        const arr = this.warningList
        arr.unshift(obj)
        this.warningList = arr
        console.log(obj)
        console.log(this.warningList)
        // console.log("收到预警消息");
      }
    },
    sendPing: function() {
      console.log('发送心跳')
      const obj = {
        messageType: 'heartbeat'
      }
      this.socket.send(JSON.stringify(obj))
      this.setIntervalWesocketPush = setInterval(() => {
        this.socket.send(JSON.stringify(obj))
      }, 20000)
    },
    close: function() {
      clearInterval(this.setIntervalWesocketPush)
      console.log('socket已经关闭')
    },

    async login() {
      await Visualizationlogin()
        .then(res => {
          console.log(res)
          this.username = res.data.name
          this.areaName = res.data.areaName
          this.mapzoom = res.data.zoom
          // this.communityId = res.data.communityId;

          this.WebSocketinit(res.data.communityId)
          // console.log(this.communityId);
          // console.log(this.areaName + "+" + this.mapzoom);

          this.initpage()
        })
        .catch(() => {})
    },
    initpage() {
      GetPelpleLoacion()
        .then(res => {
          if (res.data.state == 100) {
            var arr = []
            // console.log(res.data.list);
            res.data.list.map(item => {
              let iconobj = {}
              if (!item.deviate && !item.missing) {
                iconobj = {
                  url: 'https://www.ecorrect.cn/correct/uniapp_images/zc.png',
                  size: { width: 32, height: 32 },
                  type: 0
                }
                this.normal++
              } else if (item.deviate && !item.missing) {
                iconobj = {
                  url: 'https://www.ecorrect.cn/correct/uniapp_images/yc.png',
                  size: { width: 32, height: 32 },
                  type: 1
                }
                this.deviate++
              } else {
                iconobj = {
                  url: 'https://www.ecorrect.cn/correct/uniapp_images/sl.png',
                  size: { width: 32, height: 32 },
                  type: 2
                }
                this.missing++
              }
              const obj = {
                // eslint-disable-next-line no-irregular-whitespace
                location: this.MapTransBMap(item.longitude, item.latitude),
                picPath: item.picPath,
                address: item.location,
                name: item.name,
                iconobj: iconobj,
                userId: item.userId
              }
              arr.push(obj)
            })
            this.MapPeopleLocationArr = arr
          }
        })
        .catch(() => {})
      this.userBasicInfoCount()
      this.userSupervisionInfoCount()
    },

    userBasicInfoCount() {
      userBasicInfoCount()
        .then(res => {
          if (res.data.state == 100) {
            const areaCountarr = []
            const ageCountdataarr = []
            const totlenum =
              res.data.clockCount.complete + res.data.clockCount.uncompleted

            const clockCountobj = {
              complete: res.data.clockCount.complete,
              uncompleted: res.data.clockCount.uncompleted,
              completewidth:
                Math.round((res.data.clockCount.complete / totlenum) * 10000) /
                  100.0 +
                '%',
              uncompletedwidth:
                Math.round(
                  (res.data.clockCount.uncompleted / totlenum) * 10000
                ) /
                  100.0 +
                '%',
              uncompletedtext:
                Math.round((res.data.clockCount.complete / totlenum) * 10000) /
                  100.0 +
                '%'
            }
            res.data.ageCount.map(item => {
              if (item.number != 0) {
                ageCountdataarr.push(item)
              }
            })
            res.data.areaCount.map(item => {
              if (item.number != 0) {
                areaCountarr.push(item)
              }
            })

            this.areaCountdata.rows = areaCountarr
            this.userTypeCountdata.rows = res.data.userTypeCount
            this.ageCountdata.rows = ageCountdataarr
            this.userNumberCount = res.data.userNumberCount
            this.clockCount = clockCountobj
          }
        })
        .catch(() => {})
    },
    userSupervisionInfoCount() {
      userSupervisionInfoCount()
        .then(res => {
          // console.log(res);
          if (res.data.state == 100) {
            this.warningCountdata.rows = res.data.warningCount
            this.clockCountdata.rows = res.data.clockCount
            this.warningList = res.data.warningList
          }
        })
        .catch(() => {})
    },
    // 获取用户信息并跳转
    getCommunityuser() {
      const { userId } = this.userobj
      getUserDetail(userId).then(({ data: { list: [userDetail] }}) => {
        window.localStorage.setItem('CommunituserInfo', JSON.stringify(userDetail))// 因params无法跨页面传递，暂时用本地存储解决
        const routerPush = this.$router.resolve({ name: 'change-user' })
        window.open(routerPush.href, '_blank')
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.qxrs_char {
  width: 100%;
  height: 40%;
  // border: #00d7ff 1px solid;
}
.jjlx {
  width: 100%;
  height: 40%;
}
.today_port_main_s_l {
  padding-left: 15px;
  // width: 50%;
  height: 40px;
  background-color: #05dbb0;
  border-radius: 30px 0 0 30px;
  display: flex;
  justify-content: left;
  align-items: center;
}
.today_port_main_s h3 {
  color: #fff;
}
.today_port_main_s_r {
  padding-left: 30px;
  display: flex;
  justify-content: left;
  align-items: center;
  // width: 50%;
  height: 40px;
  background-color: #3859ff;
  border-radius: 0px 30px 30px 0px;
}
.today_port_main_s {
  margin: 0 auto;
  width: 90%;
  height: 50%;
  // border: 1px solid green;
  display: flex;
  justify-content: center;
  align-items: center;
}
.today_port_main_x {
  margin: 0 auto;
  width: 90%;
  height: 50%;
  // border: 1px solid green;
  display: flex;
  // justify-content: center;
  align-items: center;
}
.today_port_main {
  // border: 1px solid yellow;
  width: 100%;
  height: 60%;
  margin-top: 15px;
  // text-align: center;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.tjbox_right {
  width: 70%;
  height: 100px;
  // border: 1px solid yellow;
}
.tjbox_right_lr {
  text-align: left;
  color: #fff;
  width: 50%;
  height: 100%;
  // border: #606266 1px solid;
}

.tjbox_left {
  background-image: url("../../assets/index_images/tj1_bg.png");
  background-size: 100% 100%;
  // border: 1px solid yellow;
  width: 140px;
  height: 130px;

  display: flex;
  justify-content: center;
  align-items: center;
}
.tjbox_left_s h2 {
  // margin: 0;
  color: #00d7ff;
  margin-top: 10px;
  margin-bottom: 10px;
}
.tj1_mainbox {
  height: 75%;
  width: 100%;
}
.tjbox {
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  width: 50%;
  height: 100%;
  // border: 1px solid blue;
}
.char_box_list_box {
  cursor: pointer;
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 10px;
  color: #fff;
  text-align: left;
  border-bottom: 1px solid #666;
  // border: 1px solid red;
  // height: 30px;
  width: 100%;
  margin-bottom: 5px;
}

.yjicon {
  height: 25px;
  width: 25px;
  background-image: url("../../assets/index_images/xx.png");
  background-size: 100% 100%;
}
.yjmainbox {
  padding-top: 5px;
  padding-left: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 25px;
  width: 70%;
  // border: 1px solid yellow;
}
.yjrightbox {
  float: right;
  padding-top: 5px;
  padding-left: 5px;
  width: 30%;
  height: 25px;
  // border: 1px solid blue;
}
.char_box_main2 {
  // overflow: hidden;
  overflow-y: auto;
  height: 75%;
  width: 90%;
  // border: red 1px solid;
  margin: 0 auto;
  // background-image: url("../../assets/index_images/sbg.png");
  background-size: 100% 100%;
}
.char_box_main {
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  height: 75%;
  width: 90%;
  // border: red 1px solid;
  margin: 0 auto;
  // background-image: url("../../assets/index_images/sbg.png");
  background-size: 100% 100%;
  // width: 100%;
}
.char_box_title {
  padding-left: 30px;
  padding-top: 15px;
  text-align: left;
  color: #fff;
  width: 100%;
  height: 20%;
  // border: 1px solid red;
}
.char_box_title h3 {
  margin: 0;
}
.top_ht_left {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 40%;
  height: 40px;
  width: 25%;
  // border: 1px solid red;
}
.top_ht {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/index_images/top_ht.png");
  background-size: 100% 100%;
  float: right;
  height: 40px;
  width: 15%;
  // border: 1px solid red;
}
.userinfo {
  float: left;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.user_cion {
  margin-right: 10px;
  height: 30px;
  width: 30px;
  background-image: url("../../assets/index_images/user_icon.png");
  background-size: 100% 100%;
}
.top_box_left {
  padding-top: 10px;
  padding-left: 45px;
  color: #fff;
  width: 50%;
  float: left;
  // border: #00d7ff 1px solid;
}
.top_box_right {
  position: relative;
  padding-top: 20px;
  padding-right: 65px;
  color: #fff;
  width: 50%;
  float: right;
  // border: blue 1px solid;
}
.top_box {
  padding: 10px;
  // border: 1px solid red;
  position: relative;
  top: 10px;
  width: 100%;
  height: 10%;
  background-image: url("../../assets/index_images/top.png");
  background-size: 100% 100%;
}
.main_box {
  text-align: center;
  width: 100%;
  height: 80%;
  // border: 1px solid red;
}

.main_box_lr {
  vertical-align: top;
  display: inline-block;
  width: 20%;
  height: 100%;
  // border: 1px solid blue;
}
.map_box {
  margin: 20px auto;
  background-image: url("../../assets/index_images/center_bg.png");
  width: 97%;
  height: 75%;
  // height: 100%;
  background-size: 100% 100%;
  // border: 1px solid yellow;
}
.line_box {
  margin: 0 auto;
  width: 97%;
  height: 30%;
  background-image: url("../../assets/index_images/sbg.png");
  background-size: 100% 100%;
}
.char_box {
  margin: 10px;
  //   border: 1px solid;
  height: 30%;
  width: 95%;
  background-image: url("../../assets/index_images/sbg.png");
  background-size: 100% 100%;
}

.main_box_center {
  // overflow: auto;
  //   margin: 20px auto;
  text-align: center;
  display: inline-block;
  width: 54%;
  height: 100%;
  // border: 1px solid green;
}

.slidingPictures {
  padding: 0;
  width: 300px;
  border-radius: 2px;
}

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  // border: 1px solid;
  // background: url("../../assets/login_images/bigBg.png") no-repeat;
  // height: 100%;
  // width: 100%;
  // background-size: cover; //全屏展示
  // background-size: 100% 100%;
  position: absolute;
  height: 100%;
  width: 100%;
  background-image: url("../../assets/login_images/bigBg.png");
  background-repeat: repeat-y;
  background-size: 100% 100%;
}

.container {
  padding-top: 100px;
  position: relative;
  display: flex;
  flex-flow: row wrap;
  .login-box {
    width: 400px;
    height: 300px;
  }
  .puzzle-box {
    position: absolute;
  }
}

.statusItem {
  display: inline-block;
  width: 30%;
  height: 30px;
  margin-top: 40px;
  color:#fff;
  font-weight: bold;
}
</style>

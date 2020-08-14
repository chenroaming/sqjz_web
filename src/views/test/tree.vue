<script>
import recursive from '@/views/test/recursive'
import animate from 'animate.css'// 引入animate动画组件
import { mapState, mapAction, mapMutation, mapGetters } from 'vuex'
export default {
  name: 'Tree',
  components: { recursive },
  data() {
    return {
      index: 0,
      value: '',
      asyncRouterMap: [{
        id: 1,
        label: '一级 1',
        isEdit: false,
        children: [{
          id: 4,
          label: '二级 1-1',
          isEdit: false,
          children: [{
            id: 9,
            label: '三级 1-1-1',
            isEdit: false
          }, {
            id: 10,
            label: '三级 1-1-2',
            isEdit: false
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          isEdit: false

        }, {
          id: 6,
          label: '二级 2-2',
          isEdit: false

        }]
      }, {
        id: 3,
        label: '一级 3',
        isEdit: false,

        children: [{
          id: 7,
          label: '二级 3-1',
          isEdit: false

        }, {
          id: 8,
          label: '二级 3-2',
          isEdit: false

        }]
      }]
    }
  },
  mounted() {
    
  },
  computed: {
    ...mapState({
      roleType2: state => state.user.roleType
    }),
    ...mapGetters({
      roleType: 'roleType'
    })
  },
  methods: {
    edit(node, data) {
      console.log(node, data)
      // data.data.isEdit = true
      // console.log(node, data)
      node.data.isEdit = true
    },
    confirm(node, data) {
      console.log(node, data)
      // data.data.isEdit = true
      // console.log(node, data)
      node.data.isEdit = false
      node.data.label = node.data.label2
    },
    showData() {
      console.log(this.asyncRouterMap)
      console.log(this.roleType2)
    },
    go() {
      const { history: { current: { name }}} = this.$router
      name === 'children1' && this.$router.push({ name: 'children2' })
      name === 'children2' && this.$router.push({ name: 'children1' })
    },
    mouseover(index) {
      this.index = index
    },
    mouseleave(index) {
      this.index = index
    }
  }
}
</script>

<style>
  /* .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  } */
  .transition-box {
    width: 75px;
    display: inline-block;
    height: 50px;
    position: absolute;
    left: 0;
    top: 30px;
  }
</style>

<template>
  <div>
    <span>demo开发测试，非开发人员请无视</span>
    <el-tree
      ref="tree"
      :data="asyncRouterMap"
      :expand-on-click-node="false"
      show-checkbox
      node-key="label"
      default-expand-all>
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span v-if="!node.data.isEdit">{{ node.label }}</span>
        <el-input v-else v-model="node.data.label2" placeholder="请输入节点名称" size="mini"/>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => edit(node,data)">
            Edit
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => confirm(node,data)">
            Confirm
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-button @click="showData">查看</el-button>
    <recursive :recursive-arr="asyncRouterMap"/>
    <div style="position: relative;height: 100px;">
      <el-button
        type="primary"
        size="mini"
        @mouseover.native="mouseover(1)"
        @mouseleave.native="mouseover(0)">
        下拉栏1
      </el-button>
      <el-collapse-transition>
        <div v-show="index === 1" class="transition-box">下拉栏1</div>
      </el-collapse-transition>
      <el-button
        type="primary"
        size="mini"
        @mouseover.native="mouseover(2)"
        @mouseleave.native="mouseover(0)">
        下拉栏2
      </el-button>
      <el-collapse-transition>
        <div v-show="index === 2" class="transition-box" style="left: 80px;">下拉栏2</div>
      </el-collapse-transition>
      <el-button
        type="primary"
        size="mini"
        @mouseover.native="mouseover(3)"
        @mouseleave.native="mouseover(0)">
        下拉栏3
      </el-button>
      <el-collapse-transition>
        <div v-show="index === 3" class="transition-box" style="left: 150px;">下拉栏3</div>
      </el-collapse-transition>
    </div>
    <el-button type="primary" size="mini" @click="go">跳转</el-button>
    <!-- <transition :duration="{ enter: 1000, leave: 1000 }" name="animate__bounceIn">
      <router-view/>
    </transition> -->
    <transition name="fade-transform" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>


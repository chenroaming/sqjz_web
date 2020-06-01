import checkPermission from '@/utils/permission' // 权限判断函数

const mixin = {
  // 抽象出按钮级权限控制的方法
  methods: {
    checkPermission
  }
}

export default mixin

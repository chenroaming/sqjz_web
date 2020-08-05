import Vue from 'vue'
import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value
    const hasPermission = roles.length > 0 ? roles.some(role => {
      return permissionRoles.includes(role)
    }) : false
    return !!hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

// 自定义按钮权限控制指令
export const Vpermission = Vue.directive('permission', {
  bind: (el, binding, vnode) => {
    const { value } = binding // 获取值
    const roles = store.getters && store.getters.roles // 获取权限数组
    const hasPermission = roles.length > 0 ? roles.some(role => {
      return value.includes(role)
    }) : false
    !hasPermission && el.parentNode && el.parentNode.removeChild(el) // 不包含此权限则移除该dom
  }
})

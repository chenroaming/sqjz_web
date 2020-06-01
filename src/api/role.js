/**
 * 获取角色api
 */
import request from '@/utils/request'
import Qs from 'qs';


/**
 * @description 获取角色列表(社区矫正使用)
 * @return [List]
 */
export function getRoleList2(pageSize = 10, pageNumber = 1) {
  return request({
    url: '/community_correction/webClass/role/find.jhtml',
    method: 'post',
    data: Qs.stringify({
      pageSize,
      pageNumber
    })
  })
}

/**
 * @description 删除角色(社区矫正使用)
 * @return [List]
 */
export function deleteRole2(roleId) {
  return request({
    url: '/community_correction/webClass/role/delete.jhtml',
    method: 'post',
    data: Qs.stringify({
      roleId,
    })
  })
}
/**
 * @description 新增角色(社区矫正使用)
 * @return [List]
 */
export function addRole2(roleName, description, roleType = '2') {
  return request({
    url: '/community_correction/webClass/role/add.jhtml',
    method: 'post',
    data: Qs.stringify({
      roleName,
      description,
      roleType
    })
  })
}
/**
 * @description 修改角色(社区矫正使用)
 * @return [List]
 */
export function updateRole2(roleId, roleName, description) {
  return request({
    url: '/community_correction/webClass/role/update.jhtml',
    method: 'post',
    data: Qs.stringify({
      roleId,
      roleName,
      description
    })
  })
}

/**
 * @description 查询角色权限(社区矫正使用)
 * @return [List]
 */
export function findAuthority(roleId) {
  return request({
    url: '/community_correction/webClass/role/findAuthority.jhtml',
    method: 'post',
    data: Qs.stringify({
      roleId
    })
  })
}

/**
 * @description 配置角色权限(社区矫正使用)
 * @return [state]
 */
export function updateAuthority(roleId,authorityCodes) {
  return request({
    url: '/community_correction/webClass/role/updateAuthority.jhtml',
    method: 'post',
    data: Qs.stringify({
      roleId,
      authorityCodes
    })
  })
}
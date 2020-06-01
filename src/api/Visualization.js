/**
 * 首页信息api
 */
import request from '@/utils/request'
import Qs from 'qs'


export function Visualizationlogin() {
    return request({
        url: '/community_correction/webClass/statistics/getAdminInfo.jhtml',
        method: 'post'
    })
}
/**
 * @description 获取矫正人员位置
 * @return [List]
 */
export function GetPelpleLoacion() {
    let data = Qs.stringify({
        pageSize: 500,
        pageNumber: 1
    })
    return request({
        url: '/community_correction/webClass/trackRecord/find.jhtml',
        method: 'post',
        data
    })
}



/**
 * @description 矫正人员基础信息统计
 * @return [List]
 */
export function userBasicInfoCount() {
    return request({
        url: '/community_correction/webClass/statistics/userBasicInfoCount.jhtml',
        method: 'post',
    })
}

/**
 * @description 矫正人员监管信息统计
 * @return [List]
 */
export function userSupervisionInfoCount() {
    return request({
        url: '/community_correction/webClass/statistics/userSupervisionInfoCount.jhtml',
        method: 'post',
    })
}

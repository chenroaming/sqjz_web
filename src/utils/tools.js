/**
 * @description 用于计算系统时间戳转转换为YYY：mm:dd HH:mm:ss格式
 * @param [res] object
 * @returns string
 */
export function computedFormatTime(res) {
  if (res != '') {
    const Time = new Date(res)
    const year = Time.getFullYear()
    let month = Time.getMonth() + 1
    let date = Time.getDate()
    let H = Time.getHours()
    let M = Time.getMinutes()
    let S = Time.getSeconds()
    month = month < 10 ? '0' + month : month
    date = date < 10 ? '0' + date : date
    H = H < 10 ? '0' + H : H
    M = M < 10 ? '0' + M : M
    S = S < 10 ? '0' + S : S
    return year + '-' + month + '-' + date + ' ' + H + ':' + M + ':' + S
  } else {
    return '暂无'
  }
}

/**
 * @description 格式化字符串
 * @param [string]
 * @returns string
 */
export function replaceAllSemi(str) {
  if (str === null) {
    return []
  } else {
    return str.replace(/'/g, '').split(',')
  }
}

/**
 * @description 解析图片路径与字符串
 * @param [string]
 * @returns string
 */
export function changImageString(str) {
  const faceList = str.split(',')
  const imageList = []
  faceList.forEach(val => {
    const faceObj = {}
    let faceInfoArray = val.split(':')
    faceObj.featureId = faceInfoArray[0]
    faceObj.picPath = faceInfoArray[1]
    imageList.push(faceObj)
    faceInfoArray = null
  })
  return imageList
}

/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername (str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 非法字符串 */
export function validateForbiChar (str) {
  const reg = /[@^,，=*”“"#\$%\^&\-*]+/g
  return reg.test(str)
}

/* 正整数 */
export function validateIsNumber (num) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  return reg.test(num)
}

/* ip正则 */
export function validateIpAddress (str) {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(str)
}

/* 手机号 */
export function validatePhoneNumber (str) {
  const reg = /^1[23456789]\d{9}$/
  return reg.test(str)
}

/* 身份证 */
export function validateIdCard (str) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(str)
}

/* 校验密码 */
export function validatePassword (str) {
  const reg = /^[a-zA-Z\d]{6,16}$/
  return reg.test(str)
}

export const checkName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入姓名'))
  } else {
    if (validateForbiChar(value)) {
      callback(new Error('请输入正确的姓名'))
    }
    callback()
  }
}

export const checkPhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号'))
  }
  if (value !== '' && validatePhoneNumber(value) === false) {
    callback(new Error('请输入正确格式的手机号'))
  } else {
    callback()
  }
}

export const checkIdentityCard = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入身份证号'))
  }
  if (value !== '' && validateIdCard(value) === false) {
    callback(new Error('请输入正确格式的身份证号'))
  } else {
    callback()
  }
}

export const checkPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (!validatePassword(value)) {
    callback(new Error('密码需为6-16位'))
  } else {
    callback()
  }
}

export const validateUsername = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
export const validatePass = (rule, value, callback) => {
  if (value.length < 5) {
    callback(new Error('密码不能小于5位'))
  } else {
    callback()
  }
}
export const validateCode1 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error('请滑动校验验证码'))
  } else {
    callback()
  }
}
// export const validateCode = (rule, value, callback) => {
//   if (value.length !== 4) {
//     callback(new Error('请输入正确的验证码'))
//   } else {
//     callback()
//   }
// }

import Cookies from 'js-cookie'

export function setAccount(user) {
  return Cookies.set('UserAccount', user)
}

export function setCommunityName(communityName) {
  return Cookies.set('CommunityName', communityName)
}

export function setAdminName(adminName) {
  return Cookies.set('AdminName', adminName)
}

export function getCommunityName() {
  return Cookies.get('CommunityName')
}

export function getAdminName() {
  return Cookies.get('AdminName')
}

export function setroleType(role) {
  return Cookies.set('setroleType', role)
}
export function getroleType() {
  return Cookies.get('setroleType')
}
export function removeroleType() {
  return Cookies.remove('setroleType')
}
export function getAccount() {
  return Cookies.get('UserAccount')
}

export function removeAccount() {
  return Cookies.remove('UserAccount')
}

export function removeSetLogin() {
  return Cookies.remove('setLogin')
}

export function setLogin() {
  return Cookies.set('setLogin', 1)
}

export function getLogin() {
  return Cookies.get('setLogin', 1)
}

export function removeFlag() {
  if (Cookies.get('flag')) {
    return Cookies.remove('flag')
  } else {
    return
  }
}

export function removeToken() {
  if (Cookies.get('userToken')) {
    return Cookies.remove('userToken')
  } else {
    return
  }
}

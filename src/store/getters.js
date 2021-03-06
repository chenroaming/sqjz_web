const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  areaName: state => state.user.areaName,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  roleType: state => state.user.roleType,
  nowPage: state => state.app.nowPage,
  searchData: state => state.app.currentSeachData,
  communityId: state => state.user.communityId,
  appcommuityId: state => state.app.appcommuityId,
  getUserCount: state => state.app.userCount
}
export default getters

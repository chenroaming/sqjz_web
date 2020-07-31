import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    nowPage: 1, // 矫正电子档案当前页存储
    currentSeachData: {
      name: '',
      identityCard: '',
      communityId: '',
      userType: ''
    }
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_NOWPAGE: (state, pageNum) => {
      state.nowPage = pageNum
    },
    SET_SEARCHDATA: (state, searchData) => {
      state.currentSeachData = { ...searchData }
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    SetNowPage({ commit }, nowPage) {
      commit('SET_NOWPAGE', nowPage)
    },
    SetSearchData({ commit }, searchData) {
      commit('SET_SEARCHDATA', searchData)
    }
  }
}

export default app

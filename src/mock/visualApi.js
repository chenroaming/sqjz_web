import Mock from 'mockjs'
const login = {
  communityId: '1215461326456504322',
  communityName: '纵横司法所',
  message: '登录成功！',
  name: '纵横司法所管理员',
  roleType: 5,
  sessionId: 'D2F57A79E09E75417B4B08922054E832',
  state: '100'
}
const find = (pageNumber) => {
  return Mock.mock({
    'list|10': [
      {
        activityRange: 2,
        age: 27,
        cause: '测试罪名',
        communityName: '纵横司法所',
        correct: true,
        correctType: 3,
        createDate: { date: 7,
          day: 2,
          hours: 11,
          minutes: 33,
          month: 6,
          nanos: 0,
          seconds: 51,
          time: 1594092831000,
          timezoneOffset: -480,
          year: 120 },
        identityCard: '350823199211221612',
        latitude: '24.493785',
        livingArea: '测试小区',
        location: '福建省厦门市思明区观日路12号',
        loginDate: null,
        loginIp: null,
        longitude: '118.184862',
        name: `测试对象${Math.ceil(Math.random() * 10)}`,
        phone: '13000000009',
        picPath: '/correct/all_face/1215461326456504322/face/202007/1280344244422316032.jpg',
        remark: '123',
        returnTime: null,
        sex: 1,
        userFiles: [],
        userId: '1280344246137786368',
        userType: 1,
        workingCondition: '测试情况'
      }
    ],
    message: '查询成功！',
    pageNumber: pageNumber,
    pageSize: 10,
    state: '100',
    total: 20,
    totalPages: 2
  })
}

const loginOut = {
  message: '尚未登陆！',
  state: '105'
}

const removeSuccess = {
  message: '解矫成功！',
  state: '100'
}
const visualApi = {
  login,
  find,
  loginOut,
  removeSuccess
}
export default visualApi

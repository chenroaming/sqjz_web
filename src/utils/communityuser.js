import { checkName, checkPhone, checkIdentityCard } from '@/utils/validate'
const formMixin = {
  data() {
    return {
      // 监管等级
      userType: [
        { id: 1, value: '三类' },
        { id: 2, value: '二类' },
        { id: 3, value: '一类' }
      ],
      // 监管类型
      correctType: [
        { id: 1, value: '宣告缓刑' },
        { id: 2, value: '裁定假释' },
        { id: 3, value: '判处管制' },
        { id: 4, value: '暂予监外执行' }
      ],
      activityRange: [
        { id: 1, value: '区/县' },
        { id: 2, value: '市' }
      ],
      rules: {
        name: [
          { required: true, validator: checkName, trigger: ['change', 'blur'] }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: ['change', 'blur'] }
        ],
        identityCard: [
          {
            required: true,
            validator: checkIdentityCard,
            trigger: ['change', 'blur']
          }
        ],
        communityId: [
          {
            required: true,
            message: '请选择预设角色',
            trigger: ['change', 'blur']
          }
        ],
        userType: [
          {
            required: true,
            message: '请选择监管等级',
            trigger: ['change', 'blur']
          }
        ],
        correctType: [
          {
            required: true,
            message: '请选择矫正类型',
            trigger: ['change', 'blur']
          }
        ],
        activityRange: [
          {
            required: true,
            message: '请选择人员活动范围',
            trigger: ['change', 'blur']
          }
        ],
        cause: [
          {
            required: true,
            message: '请输入案由',
            trigger: ['change', 'blur']
          }
        ],
        livingArea: [
          {
            required: true,
            message: '请输入居住小区',
            trigger: ['change', 'blur']
          }
        ],
        dw: [
          {
            required: true,
            message: '请选择区域位置',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  methods: {
    exChange2(time) {
      const myDate = new Date(time)
      return `${myDate.getFullYear()}-${(myDate.getMonth() + 1)}-${myDate.getDate()}`
    }
  }
}

export default formMixin

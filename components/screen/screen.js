// components/screen/screen.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    flag: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeFlag(){
      this.setData({
        flag: !this.data.flag
      })
    },
    start(){
      this.setData({
        userInfo: ""
      })
    }
  }
})

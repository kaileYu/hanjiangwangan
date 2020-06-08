// components/auth/auth.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    islogin: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfoDisable: false, //用户获取权限的显示状态
    phoneDisable: false  // 用户手机号获取权限的按钮状态
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPhoneNumber(e) { //获取手机号
      this.setData({
        phoneDisable: true
      })
      let data = {
        data: {
          userId: app.globalData.userId,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }
      }
      app.postData('/user/update/phone', data).then(res => {
        app.globalData.phone = res.data.phone
        wx.setStorage({
          key: 'hasGetPhone',
          data: true,
        })
        this.triggerEvent('changAuthStatus', e.currentTarget.dataset.index)
      }).catch(err => {
        this.setData({
          phoneDisable: false
        })
      })
    },
    login() { // 用户登陆
      this.setData({
        phoneDisable: false,
        userInfoDisable: true
      })
      app.login().then(res => {
        this.setData({
          islogin: true
        })
      })
    }
  }
})

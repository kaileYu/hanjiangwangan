// pages/qrcode/qrcode.js
const app = getApp()
var that

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avater: '',
    name: '',
    qrcode: '',
    userId: '',
    phone: '',
    userInfo: {},
    avater: '',
    name: ''
  },
  getUserInfo(e) {
    console.log(e.detail)
  },
  login: function () {
    var that = this
    let promise = new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.globalData.userInfo = res.userInfo;
                this.getUser().then(res => {
                  resolve();
                });
                wx.hideLoading();
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              },
              fail: res => {
                wx.getUserInfo({
                  success: () => {
                    that.login()
                  },
                })
              }
            })
          }
        },
      })
    })
    return promise
  },
  getUser() {
    let that = this
    let promise = new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          let data = {
            data: {
              jcode: res.code,
              name: app.globalData.userInfo.nickName,
              sex: app.globalData.userInfo.gender,
              avatar: app.globalData.userInfo.avatarUrl,
              qrcode: ''
            }
          }
          app.postData('/user/auth', data).then(req => {
            if (req.data.busCode == 0) {
              this.data.userId = req.data.data.userId;
              this.data.phone = req.data.data.phone ? req.data.data.phone : "";
              this.data.hasLive = req.data.data.hasLive;
              this.data.avater = req.data.data.avatar;
              this.data.name = req.data.data.name;
              this.setData({
                avater: req.data.data.avatar,
                name: req.data.data.name
              })
              wx.setStorage({
                key: "hasLogin",
                data: "true"
              })
              resolve(req.data.data);
            }
          })
        },
      })
    })
    return promise;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {}
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.data.userInfo = res.userInfo
              this.getUser()
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
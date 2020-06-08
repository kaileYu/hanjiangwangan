// pages/home/home.js
const app = getApp();
let that;

function getHomeDetail() {
  app.postData('/homepage').then(res=> {
    console.log(res)
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageId: 0, //底部页面Id
    showAuth: 0, // 0：空状态图， 1: 未授权登陆， 2:已经授权登陆
    islogin: false, // 如果未授权手机号但是授权了用户信息,则将true 传给组件Auth
    userInfo: null, // 用户信息
    flag: false,   //控制开屏引导”立即体验“是否显示
  },
  // 改变页面的切换
  pageChange(value) {
    this.setData({
      pageId: value.detail
    })
    wx.setNavigationBarTitle({
      title: value.detail == 0 ? '首页': '我的'
    })
  },
  // 授权成功后转跳到首页
  changAuthStatus() {
    this.setData({
      showAuth: 2
    })
    wx.setNavigationBarTitle({
      title: '首页'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo){
        this.setData({
          userInfo: app.globalData.userInfo,
        })
    }
    // 加载的时候对是否登陆进行判断，如果没登陆，则转跳到授权页面的组件，如果登陆，直接到首页到组件
    const that = this
    // 检查是否授权了获取用户信息
    wx.getStorage({
      key: 'hasLogin',
      success: res => {
        // 检查是否授权了手机
        wx.getStorage({
          key: 'hasGetPhone',
          success: res => {
            this.setData({
              showAuth: 2
            })
            wx.setNavigationBarTitle({
              title: '首页'
            })
          },
          fail: err => {
            this.setData({
              showAuth: 1,
              islogin: true,

            })
            wx.setNavigationBarTitle({
              title: '用户授权'
            })
          }
        })
      },
      fail(err) {
        that.setData({
          showAuth: 1
        })
        wx.setNavigationBarTitle({
          title: '用户授权'
        })
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
    app.userInfoReadyCallback = res => {
      console.log(res.userInfo)
      this.setData({
        userInfo: res.userInfo
      })
    }
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
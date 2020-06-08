// pages/welfareExchange/welfareExchange.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: '',
    title: '',
    point: '',
    welfareId: '',
    userId: '',
    num: 0,
    adress: '',
    phone: 0,
    name: ''
  },
  getAdress(e){
    this.setData({
      adress: e.detail.value
    })
  },
  getName(e){
    this.setData({
      name: e.detail.value
    })
  },
  getPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  confirm() {
    wx.showModal({
      title: '提示',
      content: '确认兑换' + this.data.title + "?",
      success: res => {
        if (res.confirm) {
          let data = {
            data: {
              welfareId: this.data.welfareId,
              userId: this.data.userId
            }
          }
          app.postData('/welfare/exchange', data).then(res => {
            if (res.data.busCode == '0') {
              wx.navigateTo({
                url: '/pages/successMsg/successMsg?welfareId=' + this.data.welfareId,
              })
            } else {
              wx.showModal({
                content: res.data.busMsg,
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: options.image,
      title: options.title,
      welfareId: options.welfareId,
      point: options.point,
      userId: app.globalData.userId
    })
    console.log(options)
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
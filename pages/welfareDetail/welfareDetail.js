// pages/welfareDetail/welfareDetail.js
const app = getApp()
let that

function getDetail() {
  let data = {
    data: {
      welfareId: that.data.welfareId,
      userId: app.globalData.userId
    }
  }
  app.postData('/welfare/detail', data).then(res => {
    console.log(res)
    if (res.data.busCode == '0' && res.data.data) {
      that.setData({
        data: res.data.data
      })
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    welfareId: 0,
    data: {} //详情数据
  },
  gotoExchange() {
    if(this.data.data.enjoy == false){
      wx.showModal({
        title: '提示',
        content: '积分不足，请先赚取积分'
      })
    }else{
    wx.navigateTo({
      url: '/pages/welfareExchange/welfareExchange?welfareId=' + this.data.welfareId + '&title=' + this.data.data.title + '&image=' + this.data.data.image + '&point=' + this.data.data.point,
    })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      welfareId: options.welfareId
    })
    that = this
    getDetail()
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
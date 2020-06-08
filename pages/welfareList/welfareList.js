// pages/welfareList/welfareList.js
const app = getApp()
let that
function getWelfareList() {
  let data = {
    data: {
      page: that.data.page,
      size: that.data.size
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/welfare/list', data).then(res => {
      console.log(res)
      if (res.data.busCode == '0' && res.data.list) {
        that.setData({
          list: res.data.list
        })
      }
      resolve(res.data.list)
    })
  })
  return promise
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  gotoDetail(e){
    wx.navigateTo({
      url: '/pages/welfareDetail/welfareDetail?welfareId='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    getWelfareList()
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
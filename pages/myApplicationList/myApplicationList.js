// pages/myApplicationList/myApplicationList.js
const app = getApp()
var that

function getList(page) {
  let data = {
    data: {
      page: page,
      size: that.data.size
    }
  }
  let promise = new Promise((resolve, reject) => {
    if (that.data.id == '1') {
      app.postData('/level/protection/list', data).then(res => {
        if (res.data.busCode == '0' && res.data.list) {
          that.setData({
            lvProList: res.data.list
          })
        }
        resolve(res.data.list)
        console.log(that.data.lvProList)
      })
    } else if (that.data.id == '2') {
      app.postData("/network/app/list", data).then(res => {
        if (res.data.busCode == '0' && res.data.list) {
          that.setData({
            networkAppList: res.data.list
          })
        }
        resolve(res.data.list)
        console.log(that.data.networkAppList)
      })
    }
  })
  return promise
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    lvProList: [],
    networkAppList: [],
    page: 1,
    size: 10
  },
  gotoLvProDetail(e) {
    wx.navigateTo({
      url: '/pages/myAppDetail/myAppDetail?protectionId=' + e.currentTarget.dataset.protectionid,
    })
  },
  gotoNetworkDetail(e) {
    wx.navigateTo({
      url: '/pages/myAppDetail/myAppDetail?appId=' + e.currentTarget.dataset.appid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      id: options.id
    })
    if (options.id == '1') {
      wx.setNavigationBarTitle({
        title: '等级保护列表'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '网络应用列表',
      })
    }
    getList(1)
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
    if (this.data.networkAppList.length - 10 * this.data.page >= 0) {
      let page = this.data.page
      page = page + 1
      this.setData({
        page
      })
      getList(page)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
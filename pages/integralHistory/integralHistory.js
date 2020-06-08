// pages/integralHistory/integralHistory.js
const app = getApp()
var that

function getPointRecord() {
  let data = {
    data: {
      userId: that.data.userId,
      page: that.data.page,
      size: that.data.size
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/point/record', data).then(res => {
      if (res.data.busCode == '0') {
        console.log(res.data.list)
        that.setData({
          recordList: res.data.list
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
    recordList: [],
    showList:[],
    page: 1,
    size: 10,
    image: [],
    userId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      userId: app.globalData.userId
    })
    getPointRecord().then(()=>{
      that.data.recordList.map(item=>{
        if(item.type == 'exchange' && item.userId == that.data.userId){
          that.data.showList.push(item)
          that.setData({
            showList: that.data.showList
          })
        }
      })
      that.data.showList.map(item=>{
        let data={
          data: {
            welfareId: item.relateId
          }
        }
        app.postData('/welfare/detail',data).then(res=>{
          if(res.data.busCode == '0' && res.data.data){
            that.data.image.push(res.data.data.image)
            that.setData({
              image: that.data.image
            })
          }
        })
      })
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
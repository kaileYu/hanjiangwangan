// pages/lvprotectDetail/lvprotectDetail.js
const app = getApp()
var that
function getList(){
  let data ={
    data: {
      noticeId: that.data.noticeId
    }
  }
  app.postData('/notice/detail',data).then(res=>{
    if(res.reCode == '0' && res.data.busCode == '0'){
      console.log(res.data)
      that.setData({
        data: res.data.data,
        title: res.data.type.title
      })
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    noticeId: "",
    moudleId: '',
    title: '',
    richContent: '<div class="lvprotectDetail-top"><image class="lvprotectDetail-top-image" mode="aspectFill" src="{{data.cover}}" mode="aspectFill"></image></div><div class="text-area"><span class="text-area-content">{{data.content}}</span><div class="text-area-bottom"><div class="text-area-local">邗江网安</div><div class="text-area-time">2020-02-25</div></div></div>',
  },
  gotoRecord(){
    wx.navigateTo({
      url: '/pages/lvprotectRecord/lvprotectRecord?title=' + this.data.title + '&moudleId=' + this.data.moudleId + '&noticeId=' + this.data.noticeId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title,
      moudleId: options.moudleId
    })
    that = this
    this.setData({
      noticeId: options.noticeId,
      moudleId: options.moudleId
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
    getList()
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
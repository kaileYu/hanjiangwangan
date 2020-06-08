const app = getApp()
var that

function getNoticeData(id) {
  let data = {
    data: {
      moudleId: id
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/notice/list', data).then(res => {
      if (res.data.busCode == '0' && res.data.list) {
        that.setData({
          noticeList: res.data.list
        })
      } else if(res.data.list == "") {
        wx.showModal({
          title: "提示",
          content: "暂无数据",
          success: res => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
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
    textFlag: true, //控制搜索框内图标和字的显示
    noticeList: [], //数据数组
    searchList: [], //通过搜索框搜索到的数据数组
    content: "", //搜索框内容
    bottomFlag: false, //若搜索结果为空显示提示
    moudleId: 0,
  },
  onFocus() {
    this.setData({
      textFlag: false
    })
  },
  onBlur(e) {
    this.setData({
      content: e.detail.value
    })
    if (this.data.content == '') {
      this.setData({
        textFlag: true,
        searchList: this.data.noticeList,
        bottomFlag: false
      })
    } else {
      this.search()
    }
  },
  search() {
    let arr = []
    if (this.data.content != "") {
      let content = this.data.content
      this.data.noticeList.map(item => {
        if (RegExp(content).test(item.title)) {
          arr.push(item)
        }
      })
      this.setData({
        searchList: arr
      })
      if (this.data.searchList == "") {
        this.setData({
          bottomFlag: true
        })
      } else {
        this.setData({
          bottomFlag: false
        })
      }
    }
  },
  gotoDetail(e) {
    wx.navigateTo({
      url: '/pages/lvprotectDetail/lvprotectDetail?title=' + e.currentTarget.dataset.title + "&noticeId=" + e.currentTarget.dataset.noticeid + "&moudleId=" + this.data.moudleId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    wx.setNavigationBarTitle({
      title: options.title,
    })
    getNoticeData(options.moudleId).then(() => {
      that.setData({
        searchList: that.data.noticeList,
        moudleId: options.moudleId
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
// pages/myVoiceList/myVoiceList.js
const app = getApp();
let that;

// 获取我的发声列表
function getMyVoiceList(type) {
  let page = that.data.page
  let data = {
    data: {
      userId: app.globalData.userId,
      type: type,
      page: page,
      size: 10,
    }
  }
  app.postData('/voice/my/list', data).then(res => {
    wx.hideLoading()
    if (res.data && res.data.list) {
      let voideList = that.data.voideList
      that.setData({
        count: res.data.count,
        voideList: page == 1 ? res.data.list : [...voideList, res.data.list]
      })
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    voideList: [],
    count: 0,
    page: 1,
  },
  // 进入详情也
  goToVoiceDetail(e) {
    let voiceId = e.currentTarget.dataset.voiceid
    wx.navigateTo({
      url: '/pages/voiceDetail/voiceDetail?voiceId=' + voiceId,
    })
  },
  // 删除我的发声
  deleteVoice(e) {
    let voiceId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认删除此条发声吗',
      success: (res) => {
        if (res.confirm) {
          this.deleteVoiceToServer(voiceId)
        }
      }
    })
  },
  deleteVoiceToServer(id) {
    let data = {
      data: {
        voiceId: id,
        userId: app.globalData.userId
      }
    }
    app.postData('/voice/remove', data).then(res => {
      if (res.reCode == 0 && res.data.busCode == 0) {
        this.setData({
          page: 1,
        })
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        that = this
        getMyVoiceList(this.data.type)
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'success'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type) {
      wx.setNavigationBarTitle({
        title: options.type == 1 ? '我的线索' : options.type == 2 ? '我的咨询' : '我的建议',
      })
      this.setData({
        type: options.type
      })
      that = this;
      getMyVoiceList(options.type)
    }

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
// pages/live/live.js
const app = getApp();
let that

// 获取直播列表的接口
function getLiveList(page) {
  let data= {
    data: {
      page: page,
      size: 10
    }
  }
  app.postData('/live/list',data).then(res => {
    if(res && res.data) {
      that.setData({
        total: res.data.count,
        liveList: res.data.list,
        currentPage: res.data.count > page * 10 ? page + 1 : page
      })
    }
  })
}

// 
/**
 * isStart: 是否是开启直播
 * id : 视频Id或者 用户Id
 * 获取直播详情
 */
function getLiveDetail(isStart, id) {
  let data
  if (isStart) {
    data = {
      data: {
        userId: id
      }
    }
  } else {
    data = {
      data: {
        liveId: id
      }
    }
  }
  let promise = new Promise((relove,reject) => {
    app.postData('/live/detail', data).then(res => {
      if(res && res.data ) {
        relove(res.data)
      }
    }).catch(err => {
      wx.hideLoading();
    })
  })
  return promise;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveList: [], // 直播列表
    total: null,  // 直播列表总数
    currentPage: 1, // 当前页面页码
    hasLive: false, // 是否有直播权限
  },
  /**
   * 查看更多
   */
  gotoSeeMore () {
    console.log('12345')
  },
  /**
   * 开启直播
   */
  startLive () {
    wx.showLoading({
      title: '请稍等',
    })
    getLiveDetail(true, app.globalData.userId).then(res => {
      wx.hideLoading();
      if (res.busCode == 0 || res.busCode == -6) { // 如果busCode是0或者 -6，进入直播设置页面
        wx.navigateTo({
          url: '/pages/liveSetting/liveSetting',
          success: function (req) {
            // 通过eventChannel向被打开页面传送数据
            req.eventChannel.emit('liveDetail', { data: res.data })
          }
        })
      } else { // 请求失败或者其他
        wx.showModal({
          title: '提示',
          content: res.busMsg,
          showCancel: false,
          success: req => {
            this.refreshData();
          }
        })
      }
    })
  },


  // 进入直播间
  enterLivingRoom(e) {
    wx.showLoading({
      title: '进入直播间中',
    })
    let id = e.currentTarget.id
    getLiveDetail(false, id).then(res => {
      wx.hideLoading();
      if(res.busCode == 0) {
        wx.navigateTo({
          url: '/pages/livePlay/livePlay',
          success: function (req) {
            // 通过eventChannel向被打开页面传送数据
            req.eventChannel.emit('liveDetail', { data: res.data })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.busMsg,
          showCancel: false,
          success: req => {
            this.refreshData();
          }
        })
      }
    })
  },
  /**
   * 刷新当前数据
   */
  refreshData() {
    this.setData({
      currentPage: 1
    })
    that = this
    getLiveList(this.data.currentPage)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getMemberInfo().then(res => {
      this.setData({
        hasLive: res.data.hasLive
      })
    })
    that = this
    getLiveList(this.data.currentPage)
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
    this.refreshData();
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
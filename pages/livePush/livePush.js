// pages/livePush/livePush.js
const app = getApp();
let that

// endLive 结束直播
function endLive() {
  let data = {
    data: {
      userId: app.globalData.userId
    }
  }
  app.postData('/live/end', data).then(res => {
    if (res.data.busCode == 0) {
      var pusher = wx.createLivePusherContext('pusher');
      pusher.stop(); //停止推流
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
  })
}

// 获取弹幕列表
function getBarrageList() {
  let data = {
    data: {
      liveId: that.data.liveId,
      userId: app.globalData.userId,
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/live/danmu/list', data).then(res => {
      console.log('data',res)
      if (res.data && res.data.list && res.data.list.length > 0) {
        that.setData({
          barrageList: res.data.list
        })
        resolve(res.data.list)
      }
    })
  })
  return promise

}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFront: false,
    liveId: '', //直播Id
    liveUrl: '', // 推流地址
    barrageList: [], // 10秒内请求的弹幕列表
    allContentList: [], // 弹幕
    toLast: '',  //请求的列表
    beauty: 0,  //美颜等级
    whiteness: 0, //美白等级
    beautyFlag: false, //控制美颜进度条是否显示
    whitenessFlag: false, //控制美白进度条是否显示
    beautyTimeout: null,  //计时器，当一定时间不点击，进度条自动消失
    whitenessTimeout: null
  },
  closeLive() {
    wx.showModal({
      title: '',
      content: '您确定要关闭直播么？',
      confirmText: '提交',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          endLive()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  statechange() {

  },
  getBeauty(e){  //滑动改变美颜等级
    this.setData({
      beauty: e.detail.value
    })
  },
  beauty(){
    clearTimeout(this.data.beautyTimeout)
    this.data.beautyTimeout = setTimeout(()=>{
      this.setData({
        beautyFlag: false
      })
    },4000)
  },
  getWhiteness(e){  //滑动改变美白等级
    this.setData({
      whiteness: e.detail.value
    })
    console.log(this.data.whiteness)
  },
  setBeauty(){
    this.setData({
      beautyFlag: !this.data.beautyFlag
    })
    clearTimeout(this.data.beautyTimeout)
    this.data.beautyTimeout = setTimeout(()=>{
      this.setData({
        beautyFlag: false
      })
    },4000)
  },
  whiteness(){
    clearTimeout(this.data.whitenessTimeout)
    this.data.whitenessTimeout = setTimeout(()=>{
      this.setData({
        whitenessFlag: false
      })
    },4000)
  },
  setWhiteness(){
    this.setData({
      whitenessFlag: !this.data.whitenessFlag
    })
    clearTimeout(this.data.whitenessTimeout)
    this.data.whitenessTimeout = setTimeout(()=>{
      this.setData({
        whitenessFlag: false
      })
    },4000)
  },
  hideSlider(){
    this.setData({
      whitenessFlag: false,
      beautyFlag: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isFront: options.isfront=="true" ? true : false
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('startLiveDetail', (res) => {
      console.log('res',res)
      wx.setNavigationBarTitle({
        title: res.data.title,
      })
      this.setData({
        liveUrl: res.data.url,
        liveId: res.data.liveId
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
    this.timer = setInterval(() => {
      that = this
      getBarrageList().then((res) => {
        let len = res.length
        let time = 2000 / (len + 1)
        this.addTimer = setInterval(() => {
          let allContentList = this.data.allContentList // 获取数组的长度。
          let barrageList = this.data.barrageList
          if (barrageList.length > 0) {
            this.setData({
              allContentList: [...allContentList, barrageList[0]],
              toLast: 'item' + allContentList.length
            })
            barrageList.splice(0, 1);
          }
        }, time)
      });
    }, 2000)
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
    var pusher = wx.createLivePusherContext('pusher');
    pusher.stop();
    clearTimeout(this.timer)
    clearTimeout(this.addTimer)
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
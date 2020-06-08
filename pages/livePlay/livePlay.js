// pages/livePlay/livePlay.js
const app = getApp();
let that
import Barrage from './barrage.js';

function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}



// 获取直播详情
function getLiveDetail(id) {
  let data = {
    data: {
      liveId: id
    }
  }
  let promise = new Promise((relove, reject) => {
    app.postData('/live/detail', data).then(res => {
      if (res && res.data) {
        relove(res.data)
      }
    }).catch(err => {
      wx.hideLoading();
    })
  })
  return promise;
}

// 获取弹幕列表
function getBarrageList() {
  let data = {
    data: {
      liveId: that.data.liveInfo.liveId,
      userId: app.globalData.userId,
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/live/danmu/list', data).then(res => {
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
    liveInfo: null, // 直播详情
    fit: 'contain', //填充模式，可选值有 contain，fillCrop
    orientation: 'vertical', //画面方向
    liveUrl: '', // 直播地址
    statechange: true, // 播放的码是否继续更新
    playStatus: true, // 是否播放
    barrageStatus: false, // 是否显示弹幕
    isFullScreen: false , //是否全屏
    playTime: '79:57',  //播放时长
    currentTab: 0, // 当前的tabId
    toLast: '',  //滚动条底部Id
    keyHeight: 0, // 键盘高度
    allContentList: [], // 弹幕内容列表
    barrageList: [],
    sendMessage: '',
    version: '',
  },
  statechange(e) { //播放状态变化事件
    if (e.detail.code == 3005 && this.data.statechange) {
      this.setData({
        statechange: false
      })
      wx.showModal({
        title: '提示',
        content: '当前直播结束',
        showCancel: false,
        success: res => {
          wx.navigateBack({
            delta: 1,
          })
        }
      })
      return
    }
  },
  error(e) {
    console.log(e)
  },
  // 点击切换播放状态
  changePlayStatus() {
    let playStatus = this.data.playStatus
    let ctxI = wx.createLivePlayerContext('livePlay')
    if (playStatus) {
      //暂停
      ctxI.pause();
    } else {
      // 播放
      ctxI.play();
    }
    this.setData({
      playStatus: !playStatus
    })
  },
  // 点击切换弹幕显示状态
  changeBarrageStatus() {
    let barrageStatus = this.data.barrageStatus
    if (!barrageStatus) {
      // 开启弹幕
      this.openBarrage();
    } else {
      // 关闭弹幕
      console.log('关闭弹幕')
      this.disableDanmu()
    }
    this.setData({
      barrageStatus: !barrageStatus
    })
  },
  // 点击切换全屏和退出全屏
  changeScreenStatus() {
    let isFullScreen = this.data.isFullScreen
    let ctxI = wx.createLivePlayerContext('livePlay')
    if (!isFullScreen){
      ctxI.requestFullScreen({
        direction: 0,
      });
    } else {
      ctxI.exitFullScreen();
    }
    this.setData({
      isFullScreen: !isFullScreen
    })
  },

  // 点击切换tab
  changeTab(e) {
    console.log(e)
    let tabId = e.currentTarget.dataset.id
    this.setData({
      currentTab: tabId,
      toView: 'tabveiw' + tabId
    })
  },

  // 滚动事件
  changeSwiper(e) {
    this.setData({
      currentTab: e.detail.current - 0
    })
  },
  // 获取焦点事件
  getHeight(e) {
    console.log(e)
    this.setData({
      keyHeight: e.detail.height
    })
  },
  //失去焦点事件
  loseBlur(e) {
    this.setData({
      keyHeight: 0,
      sendMessage: e.detail.value
    })
  },

  // 发送弹幕
  sendBarrage(e) {
    this.sendMsgToServer(e.detail.value)
  },
  btnsendBarrage() {
    this.sendMsgToServer(this.data.sendMessage)
  },

  // 封装方法
  sendMsgToServer(value) {
    this.setData({
      keyHeight: 0,
    })
    if (!value) {
      return
    }
    let data = {
      data: {
        content: value,
        liveId: this.data.liveInfo.liveId,
        userId: app.globalData.userId,
        userName: app.globalData.userInfo.nickName,
        userAvatar: app.globalData.userInfo.avatarUrl
      }
    }
    let allContentList = this.data.allContentList
    app.postData('/live/danmu/send',data).then(res=> {
      console.log(res)
      if (res.data.busCode != 0) {
        wx.showModal({
          title: '提示',
          content: res.data.busMsg,
        })
        return
      }
      let item = {
        userName: app.globalData.userInfo.nickName,
        content: value,
        userAvatar: app.globalData.userInfo.avatarUrl
      }
      this.setData({
        allContentList: [...allContentList, item],
        sendMessage: '',
        toLast: 'chat-item' + allContentList.length,
      })
      this.send(value)
    })
  },

  // 发送弹幕呀
  send(value) {
    this.barrage.send({
      content: value,
      fillStyle: getRandomColor()
    })
  },

  // 开启弹幕
  openBarrage() {
    const barrage = this.barrage = new Barrage('#BarrageCanvas', {
      font: 'bold 10px sans-serif',
      duration: 5,
      lineHeight: 1,
      mode: 'separate',
    })
    barrage.open()
    this.dataDeal(this.data.allContentList)
  },
  dataDeal(arr) {
    let dataArr = []
    if (arr && arr.length > 0) {
      arr.map(item => {
        let dataItem = {
          content: item.content,
          fillStyle: getRandomColor()
        }
        this.barrage.send(dataItem)
      })
    }
  },
  // 关闭弹幕
  disableDanmu() {
    this.barrage.setRange([0, 0])
  },
  // 打开弹幕
  showAllDanmu() {
    this.barrage.setRange([0, 1])
  },
  /**
   * 生
   * 命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.liveid) {
      getLiveDetail(options.liveid).then(res=> {
        wx.setNavigationBarTitle({
          title: res.data.title,
        })
        this.setData({
          liveUrl: res.data.url,
          liveInfo: res.data
        })
      })
    } else {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('liveDetail', res => {
        wx.setNavigationBarTitle({
          title: res.data.title,
        })
        this.setData({
          liveUrl: res.data.url,
          liveInfo: res.data
        })
      })
    }
    const SDKVersion = wx.getSystemInfoSync().SDKVersion
    const version = compareVersion(SDKVersion, '2.9.0') >= 0 ? 'v2' : 'v1'
    this.setData({
      version
    })
    that = this
    getBarrageList().then(res => {
      console.log(res);
      this.setData({
        allContentList: [...res]
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
    this.timerII = setInterval(() => {
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
              toLast: 'chat-item' + allContentList.length
            })
            // this.send(barrageList[0].content);
            barrageList.splice(0, 1);
          }
        }, time)
      });
    }, 2000)
  },

  stop() {
    this.barrage.pause()
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
    clearTimeout(this.timerII)
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
    return {
      title: '我正在观看' + this.data.liveInfo.title,
      path: `/pages/livePlay/livePlay?liveid=${this.data.liveInfo.liveId}`,
      imageUrl: this.data.liveInfo.cover,
    }
  }
})
// 随机获取颜色
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
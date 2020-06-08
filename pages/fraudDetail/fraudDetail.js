// pages/fraudDetail/fraudDetail.js
const app = getApp()
var that
const html2Json = require('../../wxParser/html2json.js');
import Barrage from "../livePlay/barrage.js";
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
function string2XML(str) {
  let transData = html2Json.html2json(str,'wxParserData');
  console.log('transData', transData)
}

function getDetail() {       //获取视频详情
  let data = {
    data: {
      propId: that.data.propId,
      userId: app.globalData.userId,
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/prop/detail', data).then(res => {
      if (res.reCode == '0' && res.data.busCode == '0') {
        that.setData({
          data: res.data.data,
          type: res.data.data.type
        })
        if (res.data.data.type == 1) { //显示视频
          that.setData({
            videoId: res.data.data.videoList[0].videoUrlId,
            videoList: res.data.data.videoList,
            videoCount: res.data.data.videoCount,
            url: res.data.data.videoList[0].url,
            recordId: res.data.data.videoList[0].recordId
          })
        }
        if (res.data.data.type == 2) { // 显示富文本
          let richContent = res.data.data.content
          string2XML(richContent)
          // console.log(richContent)
          that.setData({
            richContent: richContent
          })
        }
        if (res.data.data.type == 3) { //显示图片
          let imagesArr = res.data.data.image.split(';')
          that.setData({
            imagesArr
          })
        }
        resolve(res.data.data)
      } else {
        wx.showModal({
          title: "提示",
          content: res.data.busMsg
        })
      }
    })
  })
  return promise
}
//获取评论列表
function getCommentList(id, page) {
  let data = {
    data: {
      relateId: id,
      page: page,
      size: 10
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/comment/list', data).then(res => {
      if (res.data && res.data.list) {
        res.data.list.map(item => {
          item.showMoreReply = false;
          item.replyList = [];
          item.replyCount = item.replyNum
        })
        that.setData({
          commentList: res.data.list,
          totalCount: res.data.count
        })
      }
      resolve(res.data.list)
    })
  })
  return promise
}

function getReplyList(id, index) {
  let page = Math.floor((that.data.commentList[index].replyCount - that.data.commentList[index].replyNum) / 10) + 1
  let data = {
    data: {
      commentId: id,
      page: page,
      size: 10,
    }
  }
  app.postData('/reply/list', data).then(res => {
    wx.hideLoading()
    if (res.data && res.data.list) {
      let commentList = that.data.commentList
      commentList.map(item => {
        if (item.commentId == id) {
          item.replyList = [...item.replyList, ...res.data.list]
          item.showMoreReply = true
          item.replyNum = item.replyNum - 10 <= 0 ? 0 : item.replyNum - 10
        }
      })
      that.setData({
        commentList: commentList,
      })
    }
  }).catch(err => {
    wx.hideLoading()
  })
}
// 添加评论
function addComment(value) {
  let data = {
    data: {
      relateId: that.data.propId,
      userId: app.globalData.userId,
      content: value
    }
  }
  let promise = new Promise((reslove, reject) => {
    app.postData('/comment/add', data).then(res => {
      if (res.reCode == 0 && res.data.busCode == 0) {
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
        that.setData({
          commentDetail: '',
          placeholder: '发个评论吧',
        })
        reslove();
      } else {
        reject()
      }
    })
  })
  return promise
}
// 增加回复
function addReply(value) {
  let data
  if (that.data.parentReplyId) {
    data = {
      data: {
        content: value,
        userId: app.globalData.userId,
        commentId: that.data.commentId,
        parentReplyId: that.data.parentReplyId,
        parentReplyUserId: that.data.parentReplyUserId
      }
    }
  } else {
    data = {
      data: {
        content: value,
        userId: app.globalData.userId,
        commentId: that.data.commentId,
      }
    }
  }

  let promise = new Promise((reslove, reject) => {
    app.postData('/reply/add', data).then(res => {
      if (res.reCode == 0 && res.data.busCode == 0) {
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
        that.setData({
          commentDetail: '',
          placeholder: '发个评论吧',
          commentId: null,
          parentReplyId: null, //回复评论的评论Id，
          parentReplyUserId: null,
        })
        reslove();
      } else {
        reject()
      }
    })
  })
  return promise
}

// 获取回复列表
function getReplyList(id, index) {
  let page = Math.floor((that.data.commentList[index].replyCount - that.data.commentList[index].replyNum) / 10) + 1
  let data = {
    data: {
      commentId: id,
      page: page,
      size: 10,
    }
  }
  app.postData('/reply/list', data).then(res => {
    wx.hideLoading()
    if (res.data && res.data.list) {
      let commentList = that.data.commentList
      commentList.map(item => {
        if (item.commentId == id) {
          item.replyList = [...item.replyList, ...res.data.list]
          item.showMoreReply = true
          item.replyNum = item.replyNum - 10 <= 0 ? 0 : item.replyNum - 10
        }
      })
      that.setData({
        commentList: commentList,
      })
    }
  }).catch(err => {
    wx.hideLoading()
  })
}

function getBarrageList(part) { //获取弹幕列表
  let data = {
    data: {
      videoId: that.data.videoId,
      part: part
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/video/danmu/part', data).then(res => {
      if (res.data && res.data.list && res.data.list.length > 0) {
        res.data.list.map(item => {
          item["time"] = item.sendTime,
          item["text"] = item.content
        })
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
    title: '', // 标题
    data: {}, //全部数据
    url: '', //视频播放地址
    richContent: '"<p>1.图片11</p><p><span class="fr-emoticon fr-deletable fr-emoticon-img" style="background: url(https://cdnjs.cloudflare.com/ajax/libs/emojione/2.0.1/assets/svg/1f602.svg);">&nbsp;</span>&nbsp;<img src="http://hjcspic.lekutech.com/image/d213ba2f62ab45e3b84ea85ba021d72a.jpg" style="width: 80%;" class="fr-fic fr-dib fr-shadow"></p><p>2.表格</p><table class="table fr-dashed-borders fr-alternate-rows" style="width: 100%;"><tbody class="tbody"><tr><td class="td" style="width: 16.6667%; background-color: rgb(44, 130, 201);">1</td><td class="td" style="width: 16.6667%;">2</td><td class="td" style="width: 16.6667%;">3</td><td class="td" style="width: 16.6667%;">4</td><td  class="td" style="width: 16.6667%;">5</td><td class="td" style="width: 16.6667%;">6</td></tr><tr><td class="td" style="width: 16.6667%;">1</td><td class="td" style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td></tr><tr><td class="td" style="width: 16.6667%;">2</td><td style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td></tr><tr><td class="td" style="width: 16.6667%;">3</td><td class="td" style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td><td class="td"style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td><td class="td" style="width: 16.6667%;"><br></td></tr></tbody></table>"', //富文本
    propId: '', //post的参数
    type: 0, //类型
    commentList: [], //评论列表
    totalCount: 0, //总评论数
    page: 1,
    content: '', //评论内容
    userId: '',
    commentId: 0, //评论ID
    replyList: [], //评论回复列表
    auto: false, //控制键盘是否呼出
    replyCommentId: 0, //回复评论ID
    replyId: 0, //回复id
    replyNum: 0, //回复数量
    parentReplyUserId: 0, //上级回复id
    parentReplyId: 0, //上级回复用户id
    imagesArr: [], // 如果类型是3图片，生成的图片数组
    videoId: '', //视频id
    videoList: [], //视频列表
    barrageList: [],// 弹幕内容列表
    sendMessage: '',
    sendTime: '',
    inputFlag: false,
    part: 1, //分段
    index: 0,
    timeOut: null, //定时器
    current: 0,  //swiper的 current
    videoCount: 0,  //每个分类下的视频数
    recordId: '',
    width: '', //设置视频列表的宽度
    allFlag: false, 
  },
  showInput() {
    this.setData({
      inputFlag: true
    })
    getBarrageList(1).then(res => {
      this.setData({
        barrageList: [...res]
      })
    })
    this.data.timeOut = setTimeout(()=>{
      let part = this.data.part
      part = +1
      getBarrageList(part).then(res => {
        console.log(res);
        this.setData({
          barrageList: [...res]
        })
      })
    },300000)
  },
  claerTimeOut(){
    clearTimeout(this.data.timeOut)
  },
  getSendTime(e) {
    this.setData({
      sendTime: e.detail.currentTime
    })
  },
  getContent(e) { //获取评论内容
    this.setData({
      content: e.detail.value
    })
  },
  // 删除评论
  deleteComment(e) {
    let commentId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认删除此条评论吗',
      success: (res) => {
        if (res.confirm) {
          this.deleteComentFromServer(commentId)
        }
      }
    })
  },
  deleteReply(e) {
    that = this
    let commentId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认删除此条回复吗',
      success: (res) => {
        if (res.confirm) {
          this.deleteReplyFromServer(commentId)
        }
      }
    })
  },
  //获取更多评论
  getMoreComment() {
    let page = this.data.page
    let commentList = this.data.commentList
    page++
    this.setData({
      page
    })
    getCommentList(this.data.propId, this.data.page).then(res => {
      this.data.commentList.map(item => {
        commentList.push(item)
      })
      this.setData({
        commentList
      })
    })
  },
  // 向服务器发送删除评论请求
  deleteComentFromServer(id) {
    let data = {
      data: {
        commentId: id,
        userId: app.globalData.userId
      }
    }
    app.postData('/comment/remove', data).then(res => {
      if (res.reCode == 0 && res.data.busCode == 0) {
        let commentList = this.data.commentList
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        getCommentList(this.data.propId, this.data.page).then(res => {
          // this.data.commentList.map(item => {
          //   commentList.push(item)
          // })
          commentList = res
          this.setData({
            commentList
          })
        })
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'success'
        })
      }
    })
  },

  // 向服务器发送删除回复的请求
  deleteReplyFromServer(id) {
    let data = {
      data: {
        replyId: id,
        userId: app.globalData.userId
      }
    }
    app.postData('/reply/remove', data).then(res => {
      if (res.reCode == 0 && res.data.busCode == 0) {
        let commentList = this.data.commentList
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        getCommentList(this.data.propId, this.data.page).then(res => {
          this.data.commentList.map(item => {
            commentList.push(item)
          })
          this.setData({
            commentList
          })
          console.log(this.data.commentList)
        })
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'success'
        })
      }
    })
  },
  replySomeone(e) {
    this.setData({
      focus: true,
      commentId: e.currentTarget.dataset.commentid,
      placeholder: '回复',
    })
  },
  // 回复某人
  replyToSomeOne(e) {
    console.log('e.currentTarget.dataset.item', e.currentTarget.dataset.item)
    this.setData({
      focus: true,
      commentId: e.currentTarget.dataset.item.commentId,
      parentReplyId: e.currentTarget.dataset.item.replyId,
      parentReplyUserId: e.currentTarget.dataset.item.replyUserId,
      placeholder: '回复' + e.currentTarget.dataset.item.replyUserName,
    })
  },
  loseBlur(e) {
    if (e.detail) {
      this.setData({
        commentDetail: e.detail
      })
    } else {
      this.setData({
        placeholder: '发个评论吧',
        commentId: null,
        parentReplyId: null, //回复评论的评论Id，
        parentReplyUserId: null, // 回复评论的评论楼主的
      })
    }

  },
  // 发送评论
  sendComment(e) { // 子组件通知父组件进行发送操作
    let value = e.detail
    this.setData({
      commentDetail: value
    })
    if (!value) {
      wx.showModal({
        title: '提示',
        content: '评论内容不能为空',
        showCancel: false
      })
      return
    }
    this.setData({
      btnDisable: true
    })
    if (!this.data.commentId) {
      addComment(value).then(res => {
        let commentList = this.data.commentList
        that = this
        getCommentList(this.data.propId, this.data.page)
        this.setData({
          btnDisable: false
        })
      });
    } else { // 上传添加回复
      addReply(value).then(res => {
        let commentList = this.data.commentList
        that = this
        getCommentList(this.data.propId, this.data.page)
        this.setData({
          btnDisable: false
        })
      })
    }
  },
  showReply(e) {
    let commentId = e.currentTarget.dataset.commentid
    let currentIndex = this.data.commentList.findIndex(item => item.commentId == commentId)
    that = this
    wx.showLoading({
      title: '加载中'
    })
    getReplyList(commentId, currentIndex)
  },
  getSendMessage(e) {
    this.setData({
      sendMessage: e.detail.value
    })
  },
  showDanmu(text){
    let video = wx.createVideoContext('video')
    video.sendDanmu({
      text: text,
      color: getRandomColor(),
    })
  },
  // 发送弹幕
  sendBarrage(e) {
    this.showDanmu(e.detail.value)
    this.sendMsgToServer(e.detail.value)
  },
  btnsendBarrage() {
    this.sendMsgToServer(this.data.sendMessage)
    let video = wx.createVideoContext('video')
    video.sendDanmu({
      text: this.data.sendMessage,
      // color: getRandomColor(),
      color: '#fff',
    })
  },
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
        videoId: this.data.videoId,
        userId: app.globalData.userId,
        userName: app.globalData.userInfo.nickName,
        userAvatar: app.globalData.userInfo.avatarUrl,
        sendTime: this.data.sendTime,
        fontColor: getRandomColor()
      }
    }
    let barrageList = this.data.barrageList
    app.postData('/video/danmu/send', data).then(res => {
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
        userAvatar: app.globalData.userInfo.avatarUrl,
        sendTime: this.data.sendTime,
        time: this.data.sendTime,
        userId: app.globalData.userId,
        text: value
      }
      this.setData({
        sendMessage: '',
        toLast: 'chat-item' + barrageList.length,
      })
    })
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
  navInfo(){
    this.setData({
      current: 0
    })
  },
  navComment(){
    this.setData({
      current: 1
    })
  },
  select(e){
    let url = this.data.url
    let recordId = this.data.recordId
    url = e.currentTarget.dataset.url
    recordId = e.currentTarget.dataset.recordid
    this.setData({
      url,
      recordId,
      videoId:  e.currentTarget.dataset.videoid
    })
  },
  showVideoList(){
    this.setData({
      allFlag: true
    })
  },
  closeVideoList(){
    this.setData({
      allFlag: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      propId: options.propId,
      userId: app.globalData.userId
    })
    that = this
    getDetail().then(() => {
      if (that.data.type == '1') {
        this.setData({
          width: this.data.videoCount * 202
        })
        getCommentList(options.propId, this.data.page) // 获取评论列表
      }
    })
    wx.setNavigationBarTitle({
      title: options.title
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
    return {
      title: this.data.title,
      path: `/pages/fraudDetail/fraudDetail?propId=${this.data.propId}`,
    }
  }
})
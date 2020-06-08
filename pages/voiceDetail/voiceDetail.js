// pages/voiceDetail/voiceDetail.js
const app = getApp();
let that;

// 获取网民发声详细
function getVoiceDetail(id) {
  let data = {
    data: {
      voiceId: id
    }
  }
  app.postData('/voice/detail', data).then(res => {
    wx.hideLoading()
    if (res && res.data && res.data.data) {
      const image = res.data.data.image
      let images = image.split(';')
      that.setData({
        voiceDetail: res.data.data,
        imageList: images
      })
    }
    // let images = image.split(';')
  }).catch(err=> {
    wx.hideLoading()
  })
}

// 获取评论列表
function getCommentList(id) {
  let data = {
    data: {
      relateId: id,
      page: that.data.page,
      size: 10
    }
  }
  app.postData('/comment/list', data).then(res => {
    if(res.data && res.data.list) {
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
  })
}

// 添加评论
function addComment(value) {
  let data = {
    data: {
      relateId: that.data.voiceId,
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
function getReplyList(id,index) {
  let page = Math.floor((that.data.commentList[index].replyCount - that.data.commentList[index].replyNum) / 10) + 1
  let data = {
    data: {
      commentId: id,
      page: page,
      size: 10,
    }
  }
  app.postData('/reply/list',data).then(res => {
    wx.hideLoading()
    if (res.data && res.data.list) {
      let commentList = that.data.commentList
      commentList.map(item => {
        if (item.commentId == id) {
          item.replyList = [...item.replyList,...res.data.list]
          item.showMoreReply = true
          item.replyNum = item.replyNum - 10 <= 0 ? 0 : item.replyNum - 10
        }
      })
      that.setData({
        commentList: commentList,
      })
    }
  }).catch(err=> {
    wx.hideLoading()
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '', //用户Id
    voiceDetail: null, //发声详情
    voiceId: null, // 发声Id
    imageList: [], // 图片上传的
    focus: false, // 是否聚焦
    btnDisable: false, //是否可点击
    commentDetail: '', //传给子组件的值
    placeholder: '发个评论吧',
    relateId: null,
    commentList: [], // 评论列表
    page: 1, // 页码
    totalCount: 0, //评论总数
    commentId: null, // 评论回复Id
    parentReplyId: null, //回复评论的评论Id，
    parentReplyUserId: null, // 回复评论的评论楼主的Id
  },
  // 回复楼主
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
    if(e.detail) {
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
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        getCommentList(this.data.voiceId);
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
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        getCommentList(this.data.voiceId);
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'success'
        })
      }
    })
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
        that = this
        getCommentList(this.data.voiceId)
        this.setData({
          btnDisable: false
        })
      });
    } else { // 上传添加回复
      addReply(value).then(res => {
        that = this
        getCommentList(this.data.voiceId)
        this.setData({
          btnDisable: false
        })
      })
    }
  },
  // 显示更多的回复
  showMore(e) {
    let commentId = e.currentTarget.dataset.commentid
    let currentIndex = this.data.commentList.findIndex(item => item.commentId == commentId)
    that = this
    wx.showLoading({
      title: '加载中'
    })
    getReplyList(commentId, currentIndex)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: app.globalData.userId
    })
    if (options && options.voiceId) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        voiceId: options.voiceId,
        relateId: options.voiceId
      })
      that = this
      getVoiceDetail(options.voiceId)
      getCommentList(options.voiceId)
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
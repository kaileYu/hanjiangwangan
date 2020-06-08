// pages/netizenVoice/netizenVoice.js
const app = getApp();
let that;

// 查询网民发声横幅
function getVoiceBanner () {
  app.postData('/voice/banner').then(res => {
    if(res.data && res.data.list) {
      that.setData({
        bannerList: res.data.list
      })
    }
  })
}

// 获取发声列表
function getVoideList (id,page,keywords) {
  let data = {
    data: {
      type: id == -1 ? '' : id,
      page: page,
      size: 10,
      keyword: keywords ? keywords : ''
    }
  }
  app.postData('/voice/list', data).then(res => {
    wx.hideLoading()
    if (res.data && res.data.list) {
      let voideList = that.data.voideList
      that.setData({
        count: res.data.count,
        voideList: page == 1 ? res.data.list : [...voideList, res.data.list]
      })
    }
    // 获取高度
    that.getSwiperHeight()
  })
}
// 获取我的网民发声列表
function getMyVoiceList(page, keywords) {
  let data = {
    data: {
      userId: app.globalData.userId,
      type: '',
      page: page,
      size: 10,
      keyword: keywords ? keywords : ''
    }
  }
  app.postData('/voice/my/list',data).then(res => {
    wx.hideLoading()
    if (res.data && res.data.list) {
      let voideList = that.data.voideList
      that.setData({
        count: res.data.count,
        voideList: page == 1 ? res.data.list : [...voideList, res.data.list]
      })
    }
    // 获取高度
    that.getSwiperHeight()
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: 0, // 角色管理 0.普通用户1.律师2.官方
    bannerList: [], // 网民发声横幅banner
    tabList: [
      {id: -1, name: '全部'},
      { id: 1, name: "违法线索"},
      { id: 2, name: '法律咨询' },
      { id: 3, name: '意见建议' },
      { id: 0, name: '我的'}
    ],
    currentId: -1,
    voideList: [], // 发声列表
    count: 0, // 网民发声列表的数量
    page: 1, // 分页查询页码
    keywords: '',
    swiperHeight: '',
    showBottom: false, // 显示底部
    addInfoList: [
      { title: '新增违法线索', icon: '../../images/illegal-clues.png', type: 1 },
      { title: '新增法律咨询', icon: '../../images/legal-advice.png', type:  2 },
      { title: '新增意见建议', icon: '../../images/suggestions.png', type: 3 },
    ]
  },
  // 输入内容
  inputChange(e) {
    this.setData({
      keywords: e.detail.value
    })
  },
  sendComment(e) {
    this.setData({
      keywords: e.detail.value
    })
  },
  loseBlur(e) {
    this.setData({
      keywords: e.detail.value
    })
  },
  query() {
    console.log(this.data.keywords)
    let keywords = this.data.keywords
    if (this.data.currentId !== 0) {
      getVoideList(this.data.currentId, this.data.page, keywords);
    } else {
      getMyVoiceList(this.data.page, keywords);
    } 
  },


  // 切换tab
  changeTab(e) {
    this.setData({
      currentId: e.detail,
      page: 1,
      keywords: '',
    })
    that = this;
    wx.showLoading({
      title: '请稍等',
    })
    if (e.detail== 0) { // 获取我的发声列表
      getMyVoiceList(this.data.page);
      this.setData({
        showBottom: true,
      })
    }else {
      getVoideList(e.detail ,this.data.page);
      this.setData({
        showBottom: false,
      })
    }
  },
  // 获取当前滚动的高度
  getSwiperHeight() {
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#swiper-content-height-' + this.data.currentId).boundingClientRect(function (rect) {
      console.log(rect)
      that.setData({
        swiperHeight: rect.height + 'px'
      })
    }).exec();
  },
  // 进入增加线索
  goToAddPage (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/addInfo/addInfo?type=' + id,
    })
  },
  // 进入详情也
  goToVoiceDetail(e) {
    let voiceId = e.currentTarget.dataset.voiceid
    wx.navigateTo({
      url: '/pages/voiceDetail/voiceDetail?voiceId=' + voiceId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    getVoiceBanner();
    wx.showLoading({
      title: '请稍等',
    })
    app.getMemberInfo().then(res=> {
      wx.hideLoading();
      this.setData({
        role: res.data.role
      })
      if (res.data.role == 0){
        this.setData({
          tabList: [
            { id: -1, name: '全部' },
            { id: 2, name: '法律咨询' },
            { id: 3, name: '意见建议' },
            { id: 0, name: '我的' }
          ],
        })
      } else {
        this.setData({
          tabList: [
            { id: -1, name: '全部' },
            { id: 1, name: "违法线索" },
            { id: 2, name: '法律咨询' },
            { id: 3, name: '意见建议' },
            { id: 0, name: '我的' }
          ],
        })
      }
    });
    // getVoideList(this.data.currentId,1);
  },
  // 删除我的发声
  deleteVoice(e) {
    let voiceId = e.currentTarget.dataset.id
    console.log(e)
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
    app.postData('/voice/remove',data).then(res => {
      if (res.reCode == 0 && res.data.busCode == 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        that = this
        getMyVoiceList(this.data.page)
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'success'
        })
      }
      
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
    if (this.data.currentId == 0) { // 获取我的发声列表
      getMyVoiceList(this.data.page);
      this.setData({
        showBottom: true,
      })
    } else {
      getVoideList(this.data.currentId, this.data.page);
      this.setData({
        showBottom: false,
      })
    }
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
    if (this.data.count > this.data.voideList.length) {
      let page = this.data.page
      this.setData({
        page: page+1
      })
      if(this.data.currentId !== 0) {
        getVoideList(this.data.currentId, page + 1);
      } else {
        getMyVoiceList(page + 1);
      } 
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
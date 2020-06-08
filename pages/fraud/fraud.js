// pages/fraud/fraud.js
const app = getApp()
var that
const util = require("../../utils/util")

function getMoudleData(id) {
  let data = {
    data: {
      moudleId: id
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/prop/moudle/detail', data).then(res => {
      if (res.data.busCode == '0' && res.data.data) {
        that.setData({
          bannerList: res.data.data.bannerList,
          cateList: res.data.data.cateList,
          title: res.data.data.title
        })
      } else {
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
      resolve(res.data.data)
    })
  })
  return promise
}

function getList(page) {
  let data = {
    data: {
      cateId: that.data.activedId,
      page: page,
      size: 10
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/prop/list', data).then(res => {
      let list = that.data. list
      if (res.reCode == '0' && res.data.busCode == '0') {
        that.setData({
          list: page==1? res.data.list: [...list,... res.data.list]
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
    activedId: 0,
    title: '', //头部标题
    bannerList: [], //轮播图
    cateList: [], //标签
    list: [], //宣传列表
    moudleId: '',
    page: 1, //页码
    size: 10, //pageSize
  },
  select(e) { //根据标签筛选
    that = this
    this.setData({
      activedId: e.currentTarget.dataset.id,
      page: 1
    })
    getList(1)
  },
  gotoDetail(e) {
    if (e.currentTarget.dataset.type != 4) {
      wx.navigateTo({
        url: '/pages/fraudDetail/fraudDetail?propId=' + e.currentTarget.dataset.propid + "&type=" + e.currentTarget.dataset.type + "&title=" + e.currentTarget.dataset.title,
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      let data = {
        data: {
          propId: e.currentTarget.dataset.propid,
          userId: app.globalData.userId
        }
      }
      app.postData('/prop/detail', data).then(res => {
        if (res.reCode == '0' && res.data.busCode == '0') {
          if (res.data.data.type == 4) {
            wx.downloadFile({
              url: res.data.data.file,
              success: function (res) {
                var filePath = res.tempFilePath
                var index = filePath.lastIndexOf(".");
                //获取后缀
                var ext = filePath.substr(index + 1);
                console.log('ext', ext)
                wx.openDocument({
                  filePath: filePath,
                  fileType: ext,
                  success: function (res) {
                    console.log("打开文档成功")
                    console.log(res);
                  },
                  fail: function (res) {
                    wx.showModal({
                      content: '打开文件失败',
                      showCancel: false
                    })
                  },
                  complete: function (res) {
                    console.log("complete");
                    console.log(res)
                  }
                })
              },
              fail: function (res) {
                wx.showModal({
                  content: '文件下载失败',
                  showCancel: false
                })
              },
              complete: function (res) {
                wx.hideLoading();
                console.log('complete')
                console.log(res)
              }
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      moudleId: options.moudleId,
    })
    that = this
    getMoudleData(options.moudleId).then(() => {
      this.setData({
        activedId: this.data.cateList[0].cateId
      })
      wx.setNavigationBarTitle({
        title: this.data.title
      })
      getList(1).then(() => {
        console.log(this.data.list)
        this.data.list.map(item => {
          item.createTime = util.formatTime(item.createTime)
        })
        this.setData({
          list: this.data.list
        })
      })
    })

    wx.getSystemInfo({
      success: function (res) {
        console.log(res.platform)
        that.setData({
          platform: res.platform
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
    if (this.data.list.length - this.data.page * 10 >= 0) {
      that = this
      let page = this.data.page
      page = page +1
      this.setData({
        page
      })
      let list = this.data.list
      getList(page).then((data) => {
        // this.data.list.map(item => {
        //   list.push(item)
        // })
        // this.setData({
        //   list
        // })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/myAppDetail/myAppDetail.js
const app = getApp()
const util = require('../../utils/util')
var that

function getData() {
  let promise = new Promise((resolve, reject) => {
    if (that.data.protectionId) {
      app.postData('/level/protection/list').then(res => {
        if (res.data.busCode == '0') {
          res.data.list.map(item => {
            if (item.protectionId == that.data.protectionId) {
              that.setData({
                lvProData: item
              })
            }
            resolve(item)
          })
        }
        console.log(that.data.lvProData)
      })
    } else if (that.data.appId) {
      app.postData('/network/app/list').then(res => {
        if (res.data.busCode == '0') {
          res.data.list.map(item => {
            if (item.appId == that.data.appId) {
              that.setData({
                netWorkData: item
              })
            }
            resolve(item)
          })
        }
        console.log(that.data.netWorkData)
      })
    }
  })
  return promise
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appId: 0,
    protectionId: 0,
    netWorkData: {},
    lvProData: {},
    disable: false,
    images: [],
    flag: false,
    status: '',
    systemName: '',
    level: 0,
    certCode: '',
    image: '',
    name: '',
    intro: '',
    uploadText: "上传照片",
    uploadImage: [],
    userId: 0,
    chooseImageFlag: true
  },
  getSystemName(e) {
    this.setData({
      systemName: e.detail.value
    })
  },
  getLevel(e) {
    this.setData({
      level: e.detail.value
    })
  },
  getCertCode(e) {
    this.setData({
      certCode: e.detail.value
    })
  },
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getIntro(e) {
    this.setData({
      intro: e.detail.value
    })
  },
  chooseImage() {
    let images = this.data.images
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        res.tempFilePaths.map(item => {
          images.push(item)
        })
        this.setData({
          images
        })
        console.log(images)
      },
    })
  },
  delete(e) {
    let images = this.data.images
    images.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      images
    })
  },
  uploadImage(e) { // 上传照片
    let images = this.data.images
    if (images.length != 0) {
      this.setData({
        uploadText: "上传中...",
        uploadding: true,
        chooseImageFlag: false
      })
      images.map(item => {
        app.postData('/upload/token').then(res => {
          const uploadToken = res.data.data
          let key = uploadToken.dir + util.wxuuid() + '.png'
          wx.uploadFile({
            url: uploadToken.host,
            filePath: item,
            name: 'file',
            formData: {
              'key': key,
              'OSSAccessKeyId': uploadToken.accessId,
              'policy': uploadToken.policy,
              'signature': uploadToken.signature,
              'success_action_status': 200
            },
            success: res => {
              let uploadImage = [...this.data.uploadImage, uploadToken.url + key]
              console.log(uploadImage)
              images = uploadImage
              this.data.image = uploadImage.join(";")
              this.setData({
                uploadImage,
                image: this.data.image,
                uploadText: uploadImage.length == images.length ? '上传完成' : "上传中..."
              })
              console.log(this.data.image)
            }
          })
        })
      })
    }else{
      wx.showToast({
        title: '提示',
        content: '请先选择图片'
      })
    }
  },
  commit() {
    if (this.data.protectionId) {
      if (this.data.systemName && this.data.level && this.data.certCode && this.data.image) {
        let image = this.data.image
        image = this.data.images.join(";")
        this.setData({
          image
        })
        let data = {
          data: {
            protectionId: this.data.protectionId,
            enterpriseId: this.data.lvProData.enterpriseId,
            systemName: this.data.systemName,
            level: this.data.level,
            certCode: this.data.certCode,
            image: image,
            noticeId: this.data.lvProData.noticeId,
            examineStatus: this.data.status,
            userId: this.data.userId
          }
        }
        app.postData('/level/protection/edit', data).then(res => {
          if (res.data.busCode == '0') {
            wx.showModal({
              title: '提示',
              content: "提交成功"
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.busMsg
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: "重新编辑完才可以上传"
        })
      }
    } else if (this.data.appId) {
      if (this.data.name && this.data.intro) {
        let data = {
          data: {
            appId: this.data.appId,
            enterpriseId: this.data.netWorkData.enterpriseId,
            noticeId: this.data.netWorkData.noticeId,
            name: this.data.name,
            introduction: this.data.intro,
            examineStatus: this.data.status,
            userId: this.data.userId
          }
        }
        app.postData('/network/app/edit', data).then(res => {
          if (res.data.busCode == '0') {
            wx.showModal({
              title: '提示',
              content: "提交成功"
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.busMsg
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: "重新编辑完才可以上传"
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      appId: options.appId,
      protectionId: options.protectionId,
      userId: app.globalData.userId
    })
    getData().then(() => {
      if (options.protectionId) {
        that.setData({
          images: that.data.lvProData.image.split(';'),
          status: that.data.lvProData.examineStatus
        })
        console.log(that.data.status, "status")
        if (that.data.status == '1') {
          that.setData({
            disable: true,
            flag: false
          })
        } else {
          that.setData({
            disable: false,
            flag: true
          })
        }
      } else if (options.appId) {
        that.setData({
          status: that.data.netWorkData.examineStatus
        })
        console.log(that.data.status, "status")
        if (that.data.netWorkData.examineStatus == '1') {
          that.setData({
            disable: true,
            flag: false
          })
        } else {
          that.setData({
            disable: false,
            flag: true
          })
        }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
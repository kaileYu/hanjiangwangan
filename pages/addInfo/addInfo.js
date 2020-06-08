// pages/addInfo/addInfo.js
const app = getApp()
var util = require('../../utils/util.js')
let that

function addNewVoice(str) {
  let data = {
    data: {
      title: that.data.title,
      content: that.data.content,
      type: that.data.type,
      userId: app.globalData.userId,
      image: str ? str : ''
    }
  }
  app.postData('/voice/add',data).then(res => {
    that.setData({
      submitting: false
    })
    if (res.reCode == 0 && res.data.busCode==0) {
      console.log('res', res)
      wx.navigateTo({
        url: '/pages/successMsg/successMsg',
      })
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1, // 添加信息的种类: 1.违法线索，2.法律咨询，3.意见建议
    title: '', // 添加信息的标题
    content: '', // 添加线索内容
    submitting: false, // 提交以后按钮变灰
    images: [], // 添加已选择的图片
    count: 9, // 最多可以选择的图片张数
    uploadding: false, // 点击图片上传时按钮变灰
    uploadText: "上传照片", //上传按钮文字
    filePath: [],
    uploadImage: []
  },
  /**
   * 标题输入
   */
  titleInput (e) {
    this.setData({
      title: e.detail.value
    })
  },
  /**
   * 内容输入
   */
  contentInput (e) {
    this.setData({
      content: e.detail.value
    })
  },
  /**
   * 选择照片
   */
  chooseImage () {
    var that = this;
    var count = that.data.count; // 最多可以选择的图片张数
    wx.chooseImage({
      count: count, // 最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var length = res.tempFilePaths.length; // 获取本次选择图片的数量
        count -= length;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        res.tempFilePaths.forEach(item => {
          that.data.images = that.data.images.concat({ 'url': item })
        });

        that.setData({
          count: count,
          images: that.data.images,
          filePath: res.tempFilePaths,
        });
      }
    })
  },
  previewImage (e) {// 预览照片
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [e.currentTarget.id] // 需要预览的图片http链接列表
    })
  },
  removeImage(event) { // 移除照片
    this.setData({
      count: ++this.data.count
    });
    var url = event.currentTarget.id;
    this.data.images.forEach((image, idx) => {
      if (image.url === url) {
        this.data.images.splice(idx, 1);
        // this.data.uploader.deleteFile(idx);
        this.setData({
          images: this.data.images
        });
      }
    })
  },
  uploadBtn() { // 上传照片
    console.log(this.data.images)
    this.setData({
      uploadText: "上传中...",
      uploadding: true
    })
    this.data.filePath.map(item => {
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
            this.setData({
              uploadImage,
              uploadText: uploadImage.length == this.data.filePath.length ? '上传完成' : "上传中..."
            })
          }
        })
      })
    })
  },
  /**
   * 点击取消按钮, 返回上一个页面
   */
  cancleBack () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 点击提交按钮
   */
  submitBtn () {
    if (!this.data.title && !this.data.content) {
      wx.showModal({
        title: '提示',
        content: '请填写标题和内容',
        showCancel: false
      })
      return
    }
    if (this.data.images.length > 0) {
      if (this.data.uploadImage.length<=0) {
        wx.showModal({
          title: '提示',
          content: '请上传选择的图片',
          showCancel: false
        })
        return
      }
    }
    this.setData({
      submitting: true
    })
    let imageStr = this.data.uploadImage.join(';');
    console.log('imageStr', imageStr)
    that = this
    addNewVoice(imageStr);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    // 根据传进来的不同type，显示不同的导航名称
    switch (options.type - 0) {
      case 1:
        wx.setNavigationBarTitle({
          title: '新增违法线索',
        })
        break;
      case 2:
        wx.setNavigationBarTitle({
          title: '新增法律咨询',
        })
        break;
      case 3:
        wx.setNavigationBarTitle({
          title: '新增意见建议',
        })
        break;
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
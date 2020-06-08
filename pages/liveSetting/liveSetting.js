// pages/liveSetting/liveSetting.js
const app = getApp();
var util = require('../../utils/util.js')
let that

function liveStart(data) {
  app.postData('/live/start', data).then(res => {
    console.log(res.data.data)
    if(res.data.data) {
      wx.hideLoading()
      that.setData({
        disableBtn: false
      })
    }
    wx.navigateTo({
      url: '/pages/livePush/livePush?isfront=' + that.data.isFront,
      success: function (req) {
        // 通过eventChannel向被打开页面传送数据
        req.eventChannel.emit('startLiveDetail', { data: res.data.data })
      }
    })
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveCode: '', //直播号
    liveTitle: '', // 直播名称
    liveIntroduction: '', // 直播简介
    coverType: 2,  // 封面类型 1.固定封面 2.截图封面 
    coverUrl: '',  // 封面地址,
    point: 0, // 直播积分设置
    step: 1, // 第几步
    coverTypeArr: [
      '固定封面',
      '截图封面'
    ],
    btnText: '下一步',
    isFront: false,
    disableBtn: false, //按钮置灰
    btnUploadText: '请选择图片',
    uploadDisabled: true, //按钮置灰
    imageUrl: '', // 选择图片的地址
    filePath: [], // 文件地址
    uploadImgUrl: ''
  },
  // 输入直播间名称
  inputTitle(e) {
    this.setData({
      liveTitle: e.detail.value
    })
  },
  // 积分设置
  inputPoint(e) {
    this.setData({
      point: e.detail.value
    })
  },
  // 输入直播间简介
  inputIntroduction(e) {
    this.setData({
      liveIntroduction: e.detail.value
    }) 
  },
  // 切换封面类型
  bindPickerChange(e) {
    console.log(e)
    this.setData({
      coverType: e.detail.value - 0 + 1
    })
  },
  // 添加图片
  addImage() {
    if (this.data.btnUploadText == '上传中') {
      return
    }
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imageUrl: res.tempFilePaths[0],
          btnUploadText: '上传图片',
          uploadDisabled: false, //按钮置灰
          filePath: res.tempFilePaths,
        });
      }
    })
  },
  // 点击按钮的功能
  submitBtn() {
    let step = this.data.step;
    if(step == 1) { //点击下一步
      if (this.data.liveTitle) {
        if (this.data.coverType == 1 && this.data.uploadImgUrl == '') {
          wx.showModal({
            title: '提示',
            content: '请上传直播封面',
          })
        } else {
          this.setData({
            step: 2,
            btnText: '开始直播'
          })
        }
        
      } else {
        wx.showModal({
          title: '提示',
          content: '请填写直播相关信息',
        })
      }
    } else { // 开始直播
      let data
      if (this.data.coverType == 1) {
        data = {
          data : {
            userId: app.globalData.userId,
            title: this.data.liveTitle,
            cover: this.data.uploadImgUrl,
            coverType: this.data.coverType,
            point: this.data.point,
            introduction: this.data.liveIntroduction
          }
        }
      } else {
        data = {
          data: {
            userId: app.globalData.userId,
            title: this.data.liveTitle,
            coverType: this.data.coverType,
            introduction: this.data.liveIntroduction,
            point: this.data.point
          }
        }
      }
      this.setData({
        disableBtn: true
      })
      wx.showLoading({
        title: '开启直播中...',
      })
      that = this
      liveStart(data);
    }
  },

  changeDirection() { // 点击切换摄像头方向
    let isFront = this.data.isFront
    this.setData({
      isFront: !isFront
    })
  },

  // 上传图片
  uploadImg() {
    this.setData({
      btnUploadText: '上传中',
      uploadDisabled: true, //按钮置灰
    })
    app.postData('/upload/token').then(res => {
      const uploadToken = res.data.data
      let key = uploadToken.dir + util.wxuuid() + '.png'
      wx.uploadFile({
        url: uploadToken.host,
        filePath: this.data.filePath[0],
        name: 'file',
        formData: {
          'key': key,
          'OSSAccessKeyId': uploadToken.accessId,
          'policy': uploadToken.policy,
          'signature': uploadToken.signature,
          'success_action_status': 200
        },
        success: res=> {
          this.setData({
            btnUploadText: '上传完成',
            uploadImgUrl: uploadToken.url + key
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('liveDetail', (res) => {
      console.log(res.data)
      this.setData({
        liveCode: res.data.liveCode,
        liveTitle: res.data.title,
        liveIntroduction: res.data.introduction,
        coverType: res.data.coverType, 
        point: res.data.point,
        coverUrl: res.data.cover,
        imageUrl: res.data.coverType == 1 ? res.data.cover : '',
        uploadImgUrl: res.data.coverType == 1 ? res.data.cover : '',
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
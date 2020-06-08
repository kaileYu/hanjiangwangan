// pages/lvprotectRecord/lvprotectRecord.js
const app = getApp()
var that
const util = require('../../utils/util')

function getEnterAll() { //获取所有企业
  let promise = new Promise((resolve, reject) => {
    app.postData('/enterprise/all', {}).then(res => {
      if (res.data.busCode == '0' && res.data.list) {
        that.setData({
          allList: res.data.list
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
    moudleId: 0,
    nmoudleId: 0, //网络应用moudleId
    lmoudleId: 0, //企业等保moudleId
    name: '', //单位名
    index: 0,
    num: 0, //记录textarea已经输入的字数
    allList: [], //所有企业列表
    enterpriseId: '',
    noticeId: "",
    levelProtectionList: [{ //等保post的数据
      filePath: [],
      enterpriseId: "", //企业ID
      systemName: "", //信息系统名
      level: "", //等级
      certCode: "", //证书编号
      image: "", //证书照片
      noticeId: "", //通报id
      uploadText: '点击上传',
      uploadding: false,
      uploadImage: [],
      userId: 0
    }],
    networkAppList: [{ //企业应用post的数据
      enterpriseId: "",
      name: "", //应用名称
      introduction: "", //应用简介
      noticeId: "", //通报id
      userId: 0
    }],
    page: 1,
    dindex: 0,
    num: 1,
    uploadImage: [],
    flag: true,
    userId: 0
  },
  bindPickerChange: function (e) {
    let that = this
    that.setData({
      index: e.detail.value
    })
    this.setData({
      enterpriseId: this.data.allList[this.data.index].enterpriseId
    })
  },
  chooseImage(e) { //选择图片
    let levelProtectionList = this.data.levelProtectionList
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        res.tempFilePaths.map(item => {
          levelProtectionList[this.data.dindex].filePath.push(item)
        })
        this.setData({
          levelProtectionList
        })
      },
    })
  },
  deleteImage(e) { //删除图片
    let levelProtectionList = this.data.levelProtectionList
    levelProtectionList[this.data.dindex].filePath.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      levelProtectionList
    })
  },
  uploadImage(e) { // 上传照片
    let levelProtectionList = this.data.levelProtectionList
    this.setData({
      dindex: e.currentTarget.dataset.index
    })
    levelProtectionList[this.data.dindex].filePath.map(item => {
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
            let uploadImage = [...levelProtectionList[this.data.dindex].filePath, uploadToken.url + key]
            let image = levelProtectionList[this.data.dindex].image
            levelProtectionList[this.data.dindex].uploadding  = true
            levelProtectionList[this.data.dindex].image = uploadImage
            if(uploadImage.length == levelProtectionList[this.data.dindex].image.length){
              levelProtectionList[this.data.dindex].uploadText = '上传完成'
            }else{
              levelProtectionList[this.data.dindex].uploadText= "上传中..."
            }
            levelProtectionList[this.data.dindex].image = levelProtectionList[this.data.dindex].image.join(";")
            this.setData({
              image,
              uploadImage,
              levelProtectionList,
              flag: false,
            })
            console.log(levelProtectionList[this.data.dindex].image)
          }
        })
      })
    })
  },
  getname(e) { //获取单位名称
    this.setData({
      name: e.detail.value
    })
  },
  getsysname(e) { //获取信息系统名称
    let levelProtectionList = this.data.levelProtectionList
    levelProtectionList[this.data.dindex].systemName = e.detail.value
    levelProtectionList[this.data.dindex].userId = this.data.userId
    this.setData({
      levelProtectionList
    })
  },
  getlevel(e) { //获取等级
    let levelProtectionList = this.data.levelProtectionList
    levelProtectionList[this.data.dindex].level = e.detail.value
    this.setData({
      levelProtectionList
    })
  },
  getcode(e) { //获取证书编号
    let levelProtectionList = this.data.levelProtectionList
    levelProtectionList[this.data.dindex].certCode = e.detail.value
    this.setData({
      levelProtectionList
    })
  },
  add() { //添加新系统
    let num = this.data.num
    num++
    this.setData({
      num
    })
    if (this.data.moudleId == '61ef7175647d6d25') {
      let networkAppList = this.data.networkAppList;
      networkAppList.push({
        enterpriseId: this.data.enterpriseId,
        name: "",
        introduction: "",
        noticeId: this.data.noticeId,
        userId: this.data.userId
      })
      this.setData({
        networkAppList
      })
    } else if (this.data.moudleId == 'b3c0d8eb9bc81b05') {
      let levelProtectionList = this.data.levelProtectionList;
      levelProtectionList.push({
        enterpriseId: this.data.enterpriseId,
        systemName: "",
        level: "",
        certCode: "",
        image: '',
        noticeId: this.data.noticeId,
        filePath: [],
        uploadText: '点击上传',
        uploadding: false,
        uploadImage: [],
        userId: this.data.userId
      })
      this.setData({
        levelProtectionList
      })
    }
  },
  addNum(e) { //获取应用简介
    let networkAppList = this.data.networkAppList
    networkAppList[this.data.dindex].introduction = e.detail.value,
    networkAppList[this.data.dindex].userId = this.data.userId
    this.setData({
      networkAppList
    })
  },
  getIndex(e) { //获取下标
    console.log(e.currentTarget.dataset.index)
    this.setData({
      dindex: e.currentTarget.dataset.index
    })
  },
  getAppName(e) { //获取应用名称
    let networkAppList = this.data.networkAppList
    networkAppList[this.data.dindex].name = e.detail.value
    this.setData({
      networkAppList
    })
  },
  commit() { //提交
    if (this.data.moudleId == 'b3c0d8eb9bc81b05') {
      console.log(this.data.levelProtectionList)
      let data = {
        data: {
          levelProtectionList: this.data.levelProtectionList,
        }
      }
      app.postData('/level/protection/add', data).then((res) => {
        if (res.data.busCode == '0') {
          wx.navigateTo({
            url: '/pages/successMsg/successMsg',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.busMsg
          })
        }
      })
    } else if (this.data.moudleId == '61ef7175647d6d25') {
      console.log(this.data.networkAppList)
      let data = {
        data: {
          networkAppList: this.data.networkAppList
        }
      }
      app.postData('/network/app/add', data).then(res => {
        if (res.data.busCode == '0') {
          wx.navigateTo({
            url: '/pages/successMsg/successMsg',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.reMsg
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    that = this
    this.setData({
      moudleId: options.moudleId,
      noticeId: options.noticeId,
      userId: app.globalData.userId
    })
    wx.setNavigationBarTitle({
      title: options.title + '登记'
    })
    getEnterAll().then(() => {
      this.setData({
        enterpriseId: this.data.allList[this.data.index].enterpriseId
      })
      this.data.networkAppList.map(item => {
        item.enterpriseId = this.data.enterpriseId
        item.noticeId = this.data.noticeId
        this.setData({
          networkAppList: this.data.networkAppList
        })
      })
      this.data.levelProtectionList.map(item => {
        item.enterpriseId = this.data.enterpriseId
        item.noticeId = this.data.noticeId
        this.setData({
          levelProtectionList: this.data.levelProtectionList
        })
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
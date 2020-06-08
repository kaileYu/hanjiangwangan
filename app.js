//app.js
App({
  // 全局变量
  globalData: {
    userInfo: null,
    userId: null, // 用户Id
    globalUrl: "https://hjcs.lekutech.com", // 全局网络请求的地址
    phone: '',
    point: 0, //积分
    hasLive: false, // 是否有直播权限
    role: 0, // 角色管理 0.普通用户1.律师2.官方
  },
  // 封装一个post请求方法
  postData(url, data) {
    const promise = new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.globalUrl + url,
        data: data,
        method: 'post',
        dataType: "json",
        success: res => {
          if (res.data.reCode == 0 && res.data.data) {
            resolve(res.data) // 接口成功后的回调
          } else {
            wx.showModal({
              title: '警告',
              content: '接口调用失败,请稍后再试',
              showCancel: false
            })
            reject()
          }
        },
        fail: err => {
          reject("接口没有返回数据")
          this.postData(url, data); // 重新进行页面请求
        }
      })
    })
    return promise
  },
  // 请求获得微信的用户信息
  login: function () {
    var that = this
    let promise = new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.globalData.userInfo = res.userInfo;
                this.getMemberInfo().then(res => {
                  resolve();
                });
                wx.hideLoading();
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              },
              fail: res => {
                wx.getUserInfo({
                  success: () => {
                    that.login()
                  },
                })
              }
            })
          }
        },
      })
    })
    return promise
  },

  // 发送后台获取用户的用户Id以及手机号
  getMemberInfo() {
    let that = this
    let promise = new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          wx.request({
            url: that.globalData.globalUrl + "/user/auth",
            method: 'post',
            data: {
              data: {
                jcode: res.code,
                name: that.globalData.userInfo.nickName,
                sex: that.globalData.userInfo.gender,
                avatar: that.globalData.userInfo.avatarUrl
              }
            },
            success: req => {
              if (req.data && req.data.data) {
                that.globalData.userId = req.data.data.data.userId;
                that.globalData.phone = req.data.data.data.phone ? req.data.data.data.phone : "";
                that.globalData.point = req.data.data.data.point ? req.data.data.data.point : "";
                that.globalData.hasLive = req.data.data.data.hasLive;
                that.globalData.role = req.data.data.data.role;
                wx.setStorage({
                  key: "hasLogin",
                  data: "true"
                })
                resolve(req.data.data);
              }
            }
          })
        },
      })
    })
    return promise;
  },


  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let op=wx.getLaunchOptionsSync()
    console.log(op.query,"111")
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.getMemberInfo().then(res => {
                // 如果授权登陆过,直接跳到下一页
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})
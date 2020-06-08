// components/home/home.js
const app = getApp();
let that;

function getHomeDetail() {
  app.postData('/homepage').then(res => {
    console.log(res.data)
    wx.hideLoading()
    that.setData({
      noticeList: res.data.newsList,
      bannerList: res.data.bannerList,
      internetSecurity: res.data.moudleList
    })
  }).catch(err => {
    wx.hideLoading()
  })
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: () => {
        return {}
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    noticeList: [], // 通知列表
    bannerList: [], // banner滚动
    internetSecurity: [], //网安警务处下的事务
    scrollTop: 0,
    toView: "",
    timeout: null, //计时器
    index: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoDetailPage(e) { // 路由转跳
      let item = e.currentTarget.dataset.item // 需要转跳的路由
      console.log(item);
      switch (item.clickType - 0) { // 根据不同的clickType值，做路由转跳
        case 0:
          return
          break;
        case 1:
          wx.navigateTo({
            url: '/pages/fraud/fraud?moudleId=' + item.jumpId,
          })
          break;
        case 2:
          wx.navigateTo({
            url: '/pages/netizenVoice/netizenVoice',
          })
          break;
        case 3:
          wx.navigateTo({
            url: '/pages/live/live',
          })
          break;
        case 4:
          wx.navigateTo({
            url: '/pages/alert/alert?moudleId=' + item.jumpId + '&title=' + item.title,
          })
          break;
        default:
          return
      }
    },
    // gobackTop() {
    //   clearInterval(this.data.timeout)
    //   clearTimeout(this.data.timeout)
    //   this.data.timeout = setTimeout(() => {
    //     this.setData({
    //       scrollTop: 0,
    //     })
    //   }, 1500)
    // },
    // gotoButtom() {
    //   clearInterval(this.data.timeout)
    //   this.data.timeout = setInterval(() => {
    //     let scrollTop = this.data.scrollTop
    //     scrollTop = scrollTop + 1
    //     this.setData({
    //       scrollTop
    //     })
    //   }, 20)
    // }
  },

  lifetimes: {
    attached: function () {
      wx.showLoading({
        title: '正在加载，请稍等',
      })
      that = this
      getHomeDetail();
      // 在组件实例进入页面节点树时执行
    },
    ready: function(){
      this.setData({
        scrollTop: 50
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log(app.globalData)
    },
  },
})
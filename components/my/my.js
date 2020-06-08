// components/my/my.js
const app = getApp();
var that
function getWelfareList() {
  let data = {
    data: {
      page: that.data.page,
      size: that.data.size
    }
  }
  let promise = new Promise((resolve, reject) => {
    app.postData('/welfare/list', data).then(res => {
      console.log(res)
      if (res.data.busCode == '0' && res.data.list) {
        that.setData({
          list: res.data.list
        })
      }
      resolve(res.data.list)
    })
  })
  return promise
}
Component({
  lifetimes: {
    created: function () {
      console.log(app.globalData.point)
      that = this
      getWelfareList().then(()=>{
        this.setData({
          point: app.globalData.point
        })
        this.select()
      })   
    },
  },

  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: () => {
        return {}
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    page: 1,
    size: 10,
    list: [], //福利数组
    showList: [],
    mySubmitList: [
      { icon: '../../images/my-icon/clue.png', title: '我的线索', path: '/pages/myVoiceList/myVoiceList', type: 1 },
      { icon: '../../images/my-icon/advisory.png', title: '我的咨询', path: '/pages/myVoiceList/myVoiceList', type: 2 },
      { icon: '../../images/my-icon/suggestion.png', title: '我的建议', path: '/pages/myVoiceList/myVoiceList', type: 3 },
      { icon: '../../images/my-icon/protection.png', title: '我的等保', path: '/pages/myApplicationList/myApplicationList?id=1', type: 1 },
      { icon: '../../images/my-icon/net.png', title: '我的网络应用', path: '/pages/myApplicationList/myApplicationList?id=2', type: 2 },
    ],
    point: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    select() {
      if (this.data.list.length > 4) {
        this.setData({
          showList: this.data.list.slice(0, 4)
        })
      } else {
        this.setData({
          showList: this.data.list
        })
      }
    },
    gotoDetail(e){  
      wx.navigateTo({
        url: '/pages/welfareDetail/welfareDetail?welfareId=' + e.currentTarget.dataset.id,
      })
    },
    gotoList(){
      wx.navigateTo({
        url: '/pages/welfareList/welfareList',
      })
    },
    gotoMyinfo(){   //点击前往我的信息页面
      wx.navigateTo({
        url: '/pages/myInfo/myInfo',
      })
    },
    //点击查看我的线索，咨询，建议页面
    goToMyInfo(e) {
      console.log(e)
      let path = e.currentTarget.dataset.path
      let type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: path + '?type=' + type,
      })
    },
    // 点击查看我的积分兑换记录
    gotoIntegralHistory(e) {
      wx.navigateTo({
        url: '/pages/integralHistory/integralHistory',
      })
    }
  },
})
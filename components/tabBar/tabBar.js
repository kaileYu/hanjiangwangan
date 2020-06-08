// components/tabBar/tabBar.js.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeId: 0,
    choose: false, // 是否显示中间加号内容
    closeAnmaition: false, // 是否显示关闭动画
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choosePage(e) { // 选择页面
      this.setData({
        activeId: e.currentTarget.dataset.index
      })
      this.triggerEvent('changePage', e.currentTarget.dataset.index)
    },
    showMore() { // 点击加号出现更多
      this.setData({
        choose: true,
      })
    },
    dismissMask() { // 消失遮罩层
      // 先开启收回的动画,然后关闭弹出层
      this.setData({
        closeAnmaition: true
      })
      this.timer = setTimeout(() => {
        this.setData({
          choose: false,
          closeAnmaition: false
        })
        clearTimeout(this.timer)
      },250)
    },
    preventTouchMove() {}, //阻止遮罩层下面的滚动
    goToAddPage(e) { // 点击更多时进入不同的页面
      let id = e.currentTarget.id - 0
      this.setData({
        closeAnmaition: true
      })
      this.timer = setTimeout(() => {
        this.setData({
          choose: false,
          closeAnmaition: false
        })
        clearTimeout(this.timer)
        switch (id) {
          case 1:
            wx.navigateTo({
              url: '/pages/addInfo/addInfo?type=1',
            })
            break;
          case 2:
            wx.navigateTo({
              url: '/pages/addInfo/addInfo?type=2',
            })
            break;
          case 3:
            wx.navigateTo({
              url: '/pages/addInfo/addInfo?type=3',
            })
            break;
        }
      }, 250)
    }
  }
})

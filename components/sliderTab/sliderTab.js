// components/ sliderTab/sliderTab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabList: {
      type: Array,
      value: ()=> {
        return []
      }
    },
    swiperHeight: {
      type: String,
      value: ''
    }
  },
  options: {
    multipleSlots: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    toView: 'tab-item-0'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击切换内容
    changeTab(e) {
      let id = e.currentTarget.dataset.index - 0;
      this.setData({
        currentIndex: id,
        toView: 'tab-item-' + id
      })
      // this.triggerEvent('changeTab', this.data.tabList[id].id)
    },
    // 滑动切换内容区域
    changeSwiper(e) {
      let id = e.detail.current - 0
      this.setData({
        currentIndex: e.detail.current - 0,
        toView: 'tab-item-' + id
      })
      this.triggerEvent('changeTab', this.data.tabList[id].id)
    }
  }
})

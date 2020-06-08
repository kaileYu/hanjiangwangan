// components/bottomInput/index.js
// 
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    focus: {
      type: Boolean,
      value: false,
    },
    btnDisable: {
      type: Boolean,
      value: false,
    },
    inputDetail: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: '发个评论吧'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyHeight: -2
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取焦点事件
    getHeight(e) {
      this.setData({
        keyHeight: e.detail.height
      })
    },
    //失去焦点事件
    loseBlur(e) {
      console.log('11111',e.detail.value)
      this.setData({
        keyHeight: -2,
        inputDetail: e.detail.value
      })
      this.triggerEvent('loseBlur', e.detail.value)
    },
    //bindinput
    inputChange(e) {
      this.setData({
        inputDetail: e.detail.value
      })
    },
    // 发送评论
    sendComment(e) {
      this.triggerEvent('sendComment', e.detail.value)
      this.setData({
        keyHeight: -2,
      })
    },
    // 按钮发送评论
    btnSendComment() {
      console.log('123456', this.data.inputDetail)
      this.triggerEvent('sendComment', this.data.inputDetail)
      this.setData({
        keyHeight: -2,
      })
    },

  }
})

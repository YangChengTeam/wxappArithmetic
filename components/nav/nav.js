// components/nav/nav.js
const app = getApp()


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
    back: 0
  },
  ready(){
    if (app.statusBarHeight && app.titleBarHeight){
      this.setData({
        statusBarHeight: app.statusBarHeight,
        titleBarHeight: app.titleBarHeight,
        title: app.title,
        background: app.background,
        back: app.back,
        redirectPath: app.redirectPath
      })
    }
    let thiz = this
    wx.getSystemInfo({
      success: function (res) {
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        app.statusBarHeight = res.statusBarHeight
        app.titleBarHeight = totalTopHeight - res.statusBarHeight
        thiz.setData({
          totalTopHeight: totalTopHeight,
          statusBarHeight: app.statusBarHeight,
          titleBarHeight: app.titleBarHeight,
          title: app.title,
          background: app.background,
          back: app.back,
          redirectPath: app.redirectPath
        })
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    navigateBack(e){
      if (this.data.redirectPath){
         wx.redirectTo({
           url: this.data.redirectPath,
         })
         return
      }
       wx.navigateBack({
         
       })
    }
  }
})

// compoents/tab/tab.js
const app = getApp()

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")
const kkpromise = require("../../libs/yc/yc-promise.js")

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
    tabInfos: [{
        text: '精选',
        iconPath: '../../assets/images/tab-index.png',
        selectedIconPath: '../../assets/images/tab-index-selected.png',
      },
      {
        text: '我的',
        iconPath: '../../assets/images/tab-my.png',
        selectedIconPath: '../../assets/images/tab-my-selected.png',
      }
    ]
  },
  ready() {
    let tabInfo = this.data.tabInfos[app.tabIndex]
    tabInfo.img = tabInfo.selectedIconPath
    tabInfo.selected = 'tab-item-selected'
    this.data.tabInfos.forEach((tabInfo, i) => {
      if (i != app.tabIndex) {
        tabInfo.img = tabInfo.iconPath
      }
    })
    this.setData({
      tabInfos: this.data.tabInfos
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tab(e) {  
      let index = e.currentTarget.dataset.index
      if (index == 1) return
      if (index == app.tabIndex) {
        return
      }
      app.tabIndex = index
      switch (index) {
        case 0:
          wx.redirectTo({
            url: '/pages/index/index',
          })
          break 
      }

    },
    natiageToZlhb(){
      wx.navigateTo({
        url: '/pages/zlhb/zlhb',
      })
    },
    doLogin(e){
      if(app.tabIndex == 1) return
      app.tabIndex = 1
      if(app.isLogin) {
        wx.redirectTo({
          url: '/pages/user_center/user_center',
        })
        return
      }
      app.index.login("/pages/user_center/user_center")
    }
  }
})
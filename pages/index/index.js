//index.js
//获取应用实例
const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")
const kkpromise = require("../../libs/yc/yc-promise.js")

const debug = 1
Page({
  data: {
    isShowContent: false,
    isLogin: false,
    appInfo: {},
    status: false,
    userInfo: {},
    mini: 0,
    shareImg: "../../assets/images/share_1.png",
    index: 0,
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
  gif() {
    let a = 1
    let thiz = this
    this.shareTimer = setInterval(function () {
      if (a > 4) {
        a = 1
      }
      thiz.setData({
        shareImg: `../../assets/images/share_${a}.png`
      })
      a++
    }, 300)
  },
  previewImg(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.img],
    })
  },
  natiageToMiniProgram(e) {
    console.log(e.currentTarget.dataset.appid)
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
    })
  },
  onLoad: function () {
    let thiz = this
    app.setNavInfo("微程序榜", "#fff")
    app.index = this
    wx.showShareMenu({
      withShareTicket: true
    })

    let mini = app.getMini()
    this.setData({
      mini: mini,
      tabInfos: this.data.tabInfos
    })

    if (app.isLogin) {
      console.log(app.appInfo)
      thiz.setData({
        isLogin: true,
        userInfo: app.userInfo,
        appInfo: app.appInfo,
        status: app.appInfo.status || debug
      })

      setTimeout(() => {
        thiz.setData({
          isShowContent: true,
        })
      }, 300)

    } else {
      thiz.loadData(thiz)
    }
  },
  tab(e) {
    let index = e.currentTarget.dataset.index
    if (index == app.tabIndex) return
    app.tabIndex = index
    this.setData({
      index: index
    })
  },
  loadData(thiz) {
    co(function* () {
      var [status, appInfo] = yield [kkservice.authPermission("scope.userInfo"), yield kkservice.getAppInfo()]
      wx.stopPullDownRefresh()
      appInfo = appInfo.data.data
      app.appInfo = appInfo
      if (status == kkconfig.status.authStatus.authOK) {
        thiz.login()
      } else {
        setTimeout(() => {
          thiz.setData({
            isShowContent: true
          })
        }, 300)
      }
      
      thiz.setData({
        appInfo: appInfo,
        status: (appInfo.status == 1 || debug)
      })

    })
  },
  onHide() {
    if (this.shareTimer) {
      clearInterval(this.shareTimer)
    }
  },
  login(url, callback) {
    if (this.data.isLogin && !this.refreshing) {
      if (url) {
        wx.navigateTo({
          url: url,
        })
      }
      return
    }
    let thiz = this
    co(function* () {
      if (!thiz.refreshing) {
        wx.showLoading({
          title: '正在登录...',
        })
      }
      thiz.refreshing = false
      if (yield kkservice.login()) {
        let userInfo = yield kkservice.getUserInfo()
        wx.hideLoading()

        userInfo = userInfo.data.data

        app.userInfo = userInfo
        app.isLogin = true

        thiz.setData({
          isLogin: true,
          userInfo: userInfo,
          isShowContent: true
        })

        if (url) {
          wx.navigateTo({
            url: url,
          })
        }

        if (callback) {
          callback()
        }
      }
    })
  },
  onPullDownRefresh: function () {
    let thiz = this
    thiz.refreshing = true
    thiz.loadData(thiz)
  },
  doToPath(res) {
    let url = res.currentTarget.dataset.url.trim()
    let thiz = this
    if (thiz.data.isLogin) {
      wx.navigateTo({
        url: url,
      })
      return
    }
    if (res.detail && res.detail.userInfo) {
      thiz.login(url)
    }
  },
  doLogin(res) {
    let thiz = this
    if (app.tabIndex == 1) return
    app.tabIndex = 1
    if (app.isLogin) {
      thiz.setData({
        index: 1
      })
      return
    }
    if (res.detail && res.detail.userInfo) {
      thiz.login(undefined, () => {
        thiz.setData({
          index: 1
        })
      })
    }
  },
  submit(e) {
    app.formId = e.detail.formId
    console.log(app.formId)
  },
  onShow(e) {
    this.gif()
    wx.onUserCaptureScreen(function (res) {
      app.screenShot()
    })
  },
  shareSucc(iv, ed, callback, lp, is_double, money_token) {
    let thiz = this
    if (thiz.closeShare) {
      thiz.closeShare()
    }
    co(function* () {
      let sessionRes = yield kkpromise.checkSession()
      if (sessionRes.code != "0" && sessionRes.errMsg != "checkSession:ok") {
        if (!(yield kkservice.login())) {
          wx.showToast({
            title: 'session_key获取失败',
            icon: 'none'
          })
          return
        }
      }
      let res = yield kkservice.share(iv, ed, kkconfig.global.session_key, lp, is_double, money_token)
      if (res.data && res.data.code == 1) {
        thiz.data.userInfo.playable_num = res.data.data.playable_num
        thiz.setData({
          userInfo: thiz.data.userInfo
        })
      }
      if (callback) {
        callback(thiz.data.userInfo)
      }
      console.log('lp ' + lp + res.data.msg)
      if (lp == 0) {
        wx.showToast({
          title: res.data.msg ? res.data.msg : "分享成功",
          icon: 'none'
        })
      }
      thiz.sharing = false
    })
  },
  commonShare(shareRes, title, icon, callback, lp = 0, is_double = 0, money_token) {
    title = title.replace('{0}', app.index.data.userInfo.nick_name)
    return {
      title: title,
      path: "pages/index/index",
      imageUrl: icon,
      success: function (res) {
        if (lp >= 0 && shareRes.from == "button") {
          kkcommon.share(res.shareTickets[0], callback, lp, is_double, money_token)
        }
      },
      fail() {
        this.sharing = false
        if (lp >= 0 && shareRes.from == "button") {
          wx.showToast({
            title: '取消分享',
            icon: 'none'
          })
        }
      }
    }
  },
  onShareAppMessage(shareRes) {
    let thiz = this
    let lp =  -1
    if (shareRes.from == "button") {
      lp = 0
    }
    let i = parseInt(Math.random() * 2)
    return this.commonShare(shareRes, app.index.data.appInfo.share_title[i], app.index.data.appInfo.share_ico[i], (iv, ed) => {
      thiz.shareSucc(iv, ed, (undefined), lp)
    }, lp)
  }
  ,
  loginToCashRecord(res) {
    if (app.isLogin) {
      wx.navigateTo({
        url: '/pages/cash/cash',
      })
      return
    }
    if (res.detail && res.detail.userInfo) {
      this.login('/pages/cash-record/cashRecord')
    }
  },
  loginToCooperation(res) {
    if (app.isLogin) {
      wx.navigateTo({
        url: '/pages/cooperation/cooperation',
      })
      return
    }
    if (res.detail && res.detail.userInfo) {
      this.login('/pages/cooperation/cooperation')
    }
  },
  navigateToMakeMoney(res) {
    wx.showModal({
      title: '',
      content: '敬请期待，开发中',
      showCancel: false
    })
  },
  loginToZlhb(res) {
    if (app.isLogin) {
      wx.navigateTo({
        url: '/pages/zlhb/zlhb',
      })
      return
    }
    if (res.detail && res.detail.userInfo) {
      this.login('/pages/zlhb/zlhb')
    }
  }
})
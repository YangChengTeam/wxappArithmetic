//index.js
//获取应用实例
const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")
const kkpromise = require("../../libs/yc/yc-promise.js")

Page({
  data: {
    isShowContent: false,
    gameStart_animationData: {},
    share_animationData: {},
    prize_animationData: {},
    more_animationData: {},
    rule_animationData: {},
    animationDataSucc: {},
    animationDataMaskSucc: {},
    userInfo: {
      money: 0,
      playable_num: 0,
      total_num: 0,
      played_num: 0,
    },
    isLogin: false,
    appInfo: {},
    status: false,
    mini: 0,
    adInfo: []
  },
  previewImg(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.img],
    })
  },
  loginToZlhb(res){
    console.log('loginToZlhb')
    let thiz = this
    if (res.detail && res.detail.userInfo) {
      thiz.login('/pages/zlhb/zlhb')
    }
  },
  natiageToMiniProgram(e) {
    console.log(e.currentTarget.dataset.appid)
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
    })
  },
  onLoad: function () {
    let thiz = this
    app.index = this
    wx.showShareMenu({
      withShareTicket: true
    })
    if(app.isLogin){
      thiz.setData({
        isLogin: app.isLogin,
        userInfo: app.userInfo,
        isShowContent: true,
        appInfo: app.appInfo,
        status: app.appInfo.status
      })
      if (app.userInfo.is_send == 1){
         app.id = app.userInfo.money_id
         this.toogleSucc(1)
      }
    } else {
      thiz.loadData(thiz)
    }

    try {
      var res = wx.getSystemInfoSync() 
      this.setData({
        mini: app.compareVersion(res.SDKVersion, '2.0.7')
      })
    } catch (e2) {
    }
  },
  loadData(thiz) {
    co(function* () {
      var [status, appInfo] = yield [kkservice.authPermission("scope.userInfo"), yield kkservice.getAppInfo()]
      wx.stopPullDownRefresh()
      if (status == kkconfig.status.authStatus.authOK) {
        thiz.login()
      } else {
        setTimeout(() => {
          thiz.setData({
            isShowContent: true
          })
        }, 1000)
      }
      appInfo = appInfo.data.data
      thiz.setData({
        appInfo: appInfo,
        status: (appInfo.status == 1),
        adInfo: appInfo.ad_arr && appInfo.ad_arr.length > 0 ? appInfo.ad_arr[0] : {}
      })
    })
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
        userInfo = userInfo.data.data
        thiz.setData({
          isLogin: true,
          userInfo: userInfo,
          isShowContent: true
        })
        if (userInfo.is_send == 1) {
          app.id = userInfo.money_id
          thiz.toogleSucc(1)
        }
        if (url) {
          wx.navigateTo({
            url: url,
          })
        }
        wx.hideLoading()
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
  doLogin(res) {
    let thiz = this
    if (res.detail && res.detail.userInfo) {
      thiz.login('/pages/user_center/user_center')
    }
  },
  submit(e) {
    app.formId = e.detail.formId
    console.log(app.formId)
  },
  loginToStart(res) {
    if (this.data.isLogin && this.data.userInfo.playable_num <= 0) {
      this.openShare()
      return
    }
    if (this.isStart) return
    this.isStart = true
    let thiz = this
    console.log('loginToStart')
    if (res.detail && res.detail.userInfo) {
      thiz.login('/pages/start/start')
    }
  },
  openShare() {
    this.sharing = true
    this.toogleShare(1.0)
  },
  closeShare() {
     this.toogleShare(0)
  },
  toogleShare(opacity) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.opacity(opacity).top(opacity == 0 ? "-100%" : 0).step()
    var animationMask = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
    })
    this.animationMask = animationMask
    animationMask.opacity(opacity).top(opacity == 0 ? "-100%" : 0).step()
    this.setData({
      animationDataShare: animation.export(),
      animationDataMaskShare: animationMask.export()
    })



  },
  loginToMore(res) {
    console.log('loginToMore')
    let thiz = this
    if (res.detail && res.detail.userInfo) {
      thiz.login('/pages/user_center/user_center')
    }
  },
  navigateToRule() {
    wx.navigateTo({
      url: '/pages/rule/rule',
    })
  },
  loginToCash(res) {
    console.log('loginToCash')
    let thiz = this
    if (res.detail && res.detail.userInfo) {
      thiz.login('/pages/user_center/user_center')
    }
  },
  toogleSucc(opacity) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.opacity(opacity).top(opacity == 0 ? "-100%" : 0).step()

    var animationMask = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
    })
    this.animationMask = animationMask
    animationMask.opacity(opacity).top(opacity == 0 ? "-100%" : 0).step()
    this.setData({
      animationDataSucc: animation.export(),
      animationDataMaskSucc: animationMask.export()
    })
  },
  navagateToPrizee() {
    if (this.opening) return
    this.opening = true
    let thiz = this

    co(function* () {
      wx.showLoading({
        title: '领取中...',
        mask: true
      })

      let res = yield kkservice.getRedBag(app.id)
      wx.hideLoading()
      if (res && res.data) {
        if (res.data.code == 1) {
          thiz.moneyMusicPlay()
          app.money = res.data.data.change_money
          app.index.data.userInfo.money = res.data.data.f_money
          app.index.setData({
            userInfo: app.index.data.userInfo
          })
          setTimeout(function () {
            thiz.toogleSucc(0)
            wx.redirectTo({
              url: '/pages/openmoney/openmoney',
            })
          }, 800)
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
      thiz.opening = false
    })
  },
  closeSucc(e) {
    this.toogleSucc(0)
  },
  action(e, s) {
    var index = e.currentTarget.dataset.index
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.scale(s, s).step()
    if (index == 0) {
      this.setData({
        gameStart_animationData: this.animation
      })
    } else if (index == 1) {
      this.setData({
        share_animationData: this.animation
      })
    } else if (index == 3) {
      this.setData({
        prize_animationData: this.animation
      })
    } else if (index == 4) {
      this.setData({
        more_animationData: this.animation
      })
    } else if (index == 2) {
      this.setData({
        rule_animationData: this.animation
      })
    }
  }
  ,
  start(e) {
    this.action(e, 0.8)
  },
  end(e) {
    this.action(e, 1.0)
  },
  onShareAppMessage() {
    return {
      title: this.shareTitle,
    }
  }, shareSucc(iv, ed, callback, lp, is_double, money_token) {
    let thiz = this
    if(thiz.closeShare){
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
      if (lp == 0 && res.data.msg && res.data.msg.trim().length > 0) {
        wx.showToast({
          title: res.data.msg,
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
    return this.commonShare(shareRes, app.index.data.appInfo.share_title[0], app.index.data.appInfo.share_ico[0], (iv, ed) => {
      thiz.shareSucc(iv, ed, undefined, thiz.sharing ? 0 : -1)
    }, thiz.sharing ? 0 : -1)
  }
})

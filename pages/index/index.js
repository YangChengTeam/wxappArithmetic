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
    rank_animationData: {},
    prize_animationData: {},
    invateFriend_animationData: {},
    more_animationData: {},
    rule_animationData: {},
    animationDataGzh: {},
    animationDataMaskGzh: {},
    animationDataMaskShare: {},
    animationDataShare: {},
    animationDataSucc: {},
    animationDataMaskSucc: {},

    userInfo: {
      money: 0,
      playable_num: 0,
      total_num: 0,
      played_num: 0,
    },
    isLogin: false,
    gzhImg: '../../assets/images/gzgzh-1.png',
    arrowImg: '../../assets/images/gzgzh-arrow-1.png',
  },
  onLoad: function () {
    let thiz = this
    app.index = this
    wx.showShareMenu({
      withShareTicket: true
    })
    thiz.loadData(thiz)
  },
  loadData(thiz){
    thiz.refreshing = true
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
      thiz.appInfo = appInfo
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
      if (!thiz.refreshing){
        wx.showLoading({
          title: '正在登录...',
        })
      }
      if (yield kkservice.login()) {
        let userInfo = yield kkservice.getUserInfo()

        thiz.setData({
          isLogin: true,
          userInfo: userInfo.data.data,
          isShowContent: true
        })
        app.index.data.userInfo = userInfo.data.data
        if (app.index.data.userInfo.is_send == 1) {
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
  gif() {
    let a = 0,
      b = 0
    var thiz = this
    if (this.atimer) {
      clearInterval(this.atimer)
    }
    this.atimer = setInterval(function () {
      if (a > 3) {
        a = 0
      }
      if (b > 1) {
        b = 0
      }
      thiz.setData({
        gzhImg: `../../assets/images/gzgzh-${++a}.png`,
      })
      thiz.setData({
        arrowImg: `../../assets/images/gzgzh-arrow-${++b}.png`,
      })
    }, 300)
  },
  onHide() {
    if (this.atimer) {
      clearInterval(this.atimer)
    }
  },
  onShow() {
    this.gif()
  },
  onPullDownRefresh: function () {
    let thiz = this
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
  closeSucc(e) {
    this.toogleSucc(0)
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
  navigateToRank() {
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  },
  navigateToPrize() {
    wx.navigateTo({
      url: '/pages/money-record/moneyRecord',
    })
  },
  navigateToMore() {
    wx.navigateTo({
      url: '/pages/user_center/user_center',
    })
  },
  navigateToRule() {
    wx.navigateTo({
      url: '/pages/rule/rule',
    })
  },
  navigateToCash(e) {
    wx.navigateTo({
      url: '/pages/user_center/user_center',
    })
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
        rank_animationData: this.animation
      })
    } else if (index == 2) {
      this.setData({
        prize_animationData: this.animation
      })
    } else if (index == 3) {
      this.setData({
        invateFriend_animationData: this.animation
      })
    } else if (index == 4) {
      this.setData({
        more_animationData: this.animation
      })
    } else if (index == 5) {
      this.setData({
        rule_animationData: this.animation
      })
    }
  },
  openGzh() {
    this.toogleGzh(1.0)
  },
  closeGzh() {
    this.toogleGzh(0)
  },
  toogleGzh(opacity) {
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
      animationDataGzh: animation.export(),
      animationDataMaskGzh: animationMask.export()
    })
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
  }, shareSucc(iv, ed, callback, lp) {
    let thiz = this
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
      let res = yield kkservice.share(iv, ed, kkconfig.global.session_key, lp)
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
  commonShare(shareRes, title, icon, callback, lp = 0) {
    this.closeShare()
    title = title.replace('{0}', app.index.data.userInfo.nick_name)
    return {
      title: title,
      path: "pages/index/index",
      imageUrl: icon,
      success: function (res) {
        if (lp >= 0 && shareRes.from == "button") {
          kkcommon.share(res.shareTickets[0], callback, lp)
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
  playMusic(src) {
    const innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext = innerAudioContext
    this.innerAudioContext.volume = 1
    innerAudioContext.src = src
    innerAudioContext.play()
  },
  moneyMusicPlay() {
    this.playMusic('/assets/audio/money.mp3')
  },
  navagateToPrizee() {
    setTimeout(() => {
      if (this.data.userInfo.is_send == 0) {
        wx.showToast({
          title: '每日红包已领取',
          icon: 'none'
        })
        return
      }
      let thiz = this
      co(function* () {
        wx.showLoading({
          title: '领取中...',
          mask: true
        })
        let res = yield kkservice.getRedBag(thiz.data.userInfo.money_id, app.formId)
        wx.hideLoading()
        if (res && res.data) {
          if (res.data.code == 1) {
            app.mtype = 1
            app.type = 1
            thiz.moneyMusicPlay()
            app.index.data.userInfo.is_send = 0
            app.index.data.userInfo.money = res.data.data.f_money
            app.money = res.data.data.change_money
            app.index.setData({
              userInfo: app.index.data.userInfo
            })
            thiz.toogleSucc(0)
            wx.navigateTo({
              url: '/pages/openmoney/openmoney',
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    }, 200)
  },
  onShareAppMessage(shareRes) {
    let thiz = this
    return this.commonShare(shareRes, app.index.appInfo.data.data.share_title[0], app.index.appInfo.data.data.ico[0], (iv, ed) => {
      thiz.shareSucc(iv, ed, undefined, thiz.sharing ? 0 : -1)
    }, thiz.sharing ? 0 : -1)
  }
})

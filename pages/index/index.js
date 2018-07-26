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
    sv: "",
    gameStart_animationData: {},
    rank_animationData: {},
    prize_animationData: {},
    invateFriend_animationData: {},
    more_animationData: {},
    rule_animationData: {},
    animationDataSign: {},
    animationDataMaskSign: {},
    animationDataMaskShare: {},
    animationDataShare: {},
    userInfo: {
      money: 0,
      playable_num: 0,
      total_num: 0,
      played_num: 0,
    },
    isLogin: false,
    signImg: '../../assets/images/sign-1.png',
    contactImg: '../../assets/images/contact-1.png',
    signInfo: {},
    loaded: false,
    isShowContent: false,
    online: 1,
    mini: 0,
    isShowAd: false,
    adappid: '',
    adpath: '',
    adimg: ''
  },
  compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i])
      var num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }

    return 0
  },
  natiageToMiniProgram(e) {
    let path = e.currentTarget.dataset.path
    let id = e.currentTarget.dataset.id
    let img = e.currentTarget.dataset.img
    if(img.length > 0){
       wx.previewImage({
         urls: [img],
       })
       return
    }
    wx.navigateToMiniProgram({
      appId: id,
      path: path
    })
  },
  onLoad: function () {
    let thiz = this
    app.index = this
    try {
      var res = wx.getSystemInfoSync()
      this.setData({
        mini: this.compareVersion(res.SDKVersion, '2.0.7')
      })
    } catch (e2) { 
    }
    co(function* () {
      var [status, appInfo] = yield [kkservice.authPermission("scope.userInfo"), yield kkservice.getAppInfo()]
      thiz.appInfo = appInfo
    
      let ad_arr = appInfo.data.data.ad_arr
      thiz.setData({
        isShowAd: (ad_arr.length > 0),
        signImg: (ad_arr.length > 0) ? '../../assets/images/yb-1.png' : '../../assets/images/sign-1.png',
        adappid: (ad_arr.length > 0) ? ad_arr[0].url.split('?')[0] :'',
        adpath: (ad_arr.length > 0 && ad_arr[0].url.split('?').length > 1) ? ad_arr[0].url.split('?')[1] : '',
        adimg: (ad_arr.length > 0) ?  ad_arr[0].xcx_img : ''
      })
      if (status == kkconfig.status.authStatus.authOK) {
        thiz.login(undefined, undefined, appInfo.data.data.play_total_num)
      } else {
        setTimeout(() => {
          thiz.setData({
            isShowContent: true
          })
        }, 1000)
      }
      wx.showShareMenu({
        withShareTicket: true
      })
    })
    wx.getSystemInfo({
      success: function (res) {
        thiz.setData({
          sv: res.SDKVersion
        })
      },
    })
  },
  navigateToCash(e) {
    wx.navigateTo({
      url: '/pages/cash/cash',
    })
  },
  onPullDownRefresh: function () {
    let thiz = this
    co(function* () {
      let userInfo = yield kkservice.getUserInfo()
      if (userInfo.data && userInfo.data.code == 1) {
        thiz.setData({
          userInfo: userInfo.data.data,
          isShowContent: true
        })
      }
      wx.stopPullDownRefresh()
    })
  },
  onHide() {
    if (this.atimer) {
      clearInterval(this.atimer)
    }
  },
  onShow() {
    if (this.data.isLogin) {
      let opsign = kkcommon.isStorageInToday('opsign')
      if (!opsign) {
        this.openSign()
      }
    }
    this.gif()
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
      if (b > 3) {
        b = 0
      }
      thiz.setData({
        signImg: (thiz.data.isShowAd) ? `../../assets/images/yb-${++a}.png` : `../../assets/images/sign-${++a}.png`,
      })
      thiz.setData({
        contactImg: `../../assets/images/contact-${++b}.png`,
      })
    }, 300)
  },
  login(url, callback, total_num) {
    if (this.data.isLogin) {
      if (url) {
        wx.navigateTo({
          url: url,
        })
      }
      return
    }
    let thiz = this
    co(function* () {
      if (thiz.data.isShowContent) {
        wx.showLoading({
          title: '登录中...',
        })
      }
      if (yield kkservice.login()) {
        let [userInfo, signInfo] = yield [kkservice.getUserInfo(), kkservice.getuserSignInfo()]
        if (thiz.data.isShowContent) {
          wx.hideLoading()
        }
        thiz.signInfo = signInfo.data.data
        if (kkcommon.isStorageInToday('sign')) {
          thiz.signInfo.signed = true
        }
        if (total_num) {
          userInfo.data.data.total_num = total_num
        }
        thiz.setData({
          isLogin: true,
          userInfo: userInfo.data.data,
          signInfo: thiz.signInfo
        })

        if (url) {
          wx.navigateTo({
            url: url,
          })
        } else {
          let opsign = kkcommon.isStorageInToday('opsign')
          if (!opsign) {
            thiz.openSign()
          }
        }
        if (callback) {
          callback()
        }
      }
      thiz.setData({
        isShowContent: true
      })
    })
  },
  doLogin(res) {
    let thiz = this
    if (res.detail && res.detail.userInfo) {
      thiz.login('/pages/user_center/user_center')
    }
  },

  loginToStart(res) {
    if (this.data.isLogin && this.data.userInfo.playable_num <= 0) {
      // if (this.appInfo.data.data.status != 1){
      //    this.setData({
      //       online: 0
      //    })
      // } 
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
  loginToMore(res) {
    console.log('loginToMore')
    let thiz = this
    if (res.detail && res.detail.userInfo) {
      thiz.login('/pages/user_center/user_center')
    }
  },
  navigateToRank() {
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  },
  navigateToPrize() {
    wx.navigateTo({
      url: '/pages/cash/cash',
    })
  },
  navigateToRule() {
    wx.navigateTo({
      url: '/pages/rule/rule',
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
  start(e) {
    this.action(e, 0.8)
  },
  end(e) {
    this.action(e, 1.0)
  },
  openSign() {
    this.toogleSign(1.0)
  },
  closeSign() {
    this.toogleSign(0)
  },
  toogleSign(opacity) {
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
      animationDataSign: animation.export(),
      animationDataMaskSign: animationMask.export()
    })
  },
  submit(e) {
    app.formId = e.detail.formId
  },
  signIn(e, callback) {
    if (this.signInfo.signed) return
    let thiz = this
    co(function* () {
      wx.showLoading({
        title: '正在签到...',
        mask: true
      })
      let res = yield kkservice.userSignIn()
      console.log(res)
      wx.hideLoading()
      if (res.data && res.data.code == 1) {
        kkcommon.storageToday('opsign')
        kkcommon.storageToday('sign', () => {
          thiz.signInfo.sign_count = res.data.data.sign_count
          thiz.signInfo.signed = true
          if (res.data.data.user_info.name == 'playable_num') {
            thiz.data.userInfo.playable_num = res.data.data.user_info.value
          } else if (res.data.data.user_info.name == 'money') {
            thiz.data.userInfo.money = res.data.data.user_info.value
          }
          thiz.setData({
            signInfo: thiz.signInfo,
            userInfo: thiz.data.userInfo
          })

        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        kkcommon.storageToday('opsign')
        kkcommon.storageToday('sign', () => {
          thiz.signInfo.signed = true
          thiz.setData({
            signInfo: thiz.signInfo
          })
        })
      }
      if (callback) {
        callback(thiz.signInfo, thiz.data.userInfo)
      }
    })
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
  shareSucc(iv, ed, callback, lp) {
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
  onShareAppMessage(shareRes) {
    let thiz = this
    return this.commonShare(shareRes, app.index.appInfo.data.data.share_title[0], app.index.appInfo.data.data.ico[0], (iv, ed) => {
      thiz.shareSucc(iv, ed, undefined, thiz.sharing ? 0 : -1)
    }, thiz.sharing ? 0 : -1)
  }
})
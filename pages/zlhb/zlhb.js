// pages/zlhb/zlhb.js

//获取应用实例
const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    invate_count: 2,
    share_userid: "",
    is_from_share: false,
    ruleList: [],
    animationDataMaskRule: {},
    animationDataRule: {},

    animationDataMaskHb: {},
    animationDataHb: {},
    count: 3,
    userInfo: {
      share_money: 0.00
    },
    isLogin: false,
    isShowContent: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData(options)
  },
  loadData(options) {
    this.index = options && options.index ? options.index : ""
    this.user_id = options && options.id ? options.id : ""
    app.fid = options && options.fid ? options.fid : ""
    console.log("user_id:" + this.user_id)
    console.log("fid:" + app.fid)
    let is_from_share = this.index == 1 ? true : false
    let thiz = this

    co(function* () {
      let status, appInfo, userInfo, helpInfo
      if (is_from_share) {
        [status, appInfo] = yield [kkservice.authPermission("scope.userInfo"), yield kkservice.getAppInfo()]

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
        app.appInfo = appInfo
      } else {
        appInfo = app.index.data.appInfo
        userInfo = app.index.data.userInfo
        app.userInfo = userInfo
        app.isLogin = true
        let helpInfo = yield kkservice.userHelp(app.fid, thiz.user_id)
        helpInfo = helpInfo.data.data
        let count = thiz.data.invate_count - helpInfo.list.length
        for (let i = helpInfo.list.length; i < thiz.data.invate_count; i++) {
          helpInfo.list.push({})
        }
        userInfo.share_money = helpInfo.share_money
        wx.stopPullDownRefresh()
        thiz.setData({
          isLogin: true,
          userInfo: userInfo,
          isShowContent: true,
          helpInfo: helpInfo,
          count: count > 0 ? count : 0
        })
        console.log("msg" + helpInfo.msg)
        if (helpInfo.is_get == 0) {
          thiz.toogleHb(1)
        } else {
          if (helpInfo.msg) {
            wx.showModal({
              title: '',
              content: helpInfo.msg,
              showCancel: false
            })
          }
        }
      }
      app.appInfo = appInfo
      var ruleList = (appInfo.share_money_rule.split('\n'))
      ruleList.forEach((v, k) => {
        ruleList[k] = v.replace(`${k + 1}.`, '')
      })
      console.log("is_from_share" + is_from_share)
      thiz.setData({
        ruleList: ruleList,
        is_from_share: is_from_share,
      })
    })
  },
  submit(e) {
    app.formId = e.detail.formId
    wx.setStorageSync("formId", app.formId)
    console.log(app.formId)
  },
  onPullDownRefresh: function () {
    let thiz = this
    thiz.refreshing = true
    thiz.loadData({
      id: thiz.user_id,
      fid: app.fid,
      index: thiz.index
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
        let [userInfo, helpInfo] = [yield kkservice.getUserInfo(), yield kkservice.userHelp(app.fid, thiz.user_id)]
        wx.stopPullDownRefresh()
        userInfo = userInfo.data.data
        helpInfo = helpInfo.data.data
        console.log("userInfo" + userInfo)
        let count = thiz.data.invate_count - helpInfo.list.length
        for (let i = helpInfo.list.length; i < thiz.data.invate_count; i++) {
          helpInfo.list.push({})
        }
        userInfo.share_money = helpInfo.share_money
        thiz.setData({
          isLogin: true,
          userInfo: userInfo,
          isShowContent: true,
          helpInfo: helpInfo,
          count: count > 0 ? count : 0
        })
        console.log("msg" + helpInfo.msg)

        if (helpInfo.is_get == 0) {
          thiz.toogleHb(1)
        } else {
          if (helpInfo.msg) {
            wx.showModal({
              title: '',
              content: helpInfo.msg,
              showCancel: false
            })
          }
        }
        app.isLogin = true
        app.userInfo = userInfo

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
  // userGetMoney: userGetMoney
  caseMoney() {
    console.log(this.data.helpInfo.status)
    if (this.data.helpInfo.status != 1) {
      wx.showModal({
        title: '提现失败',
        content: `还需邀请${this.data.count}位好友完成助力任务！`,
        showCancel: false
      })
      return
    }
    let thiz = this
    co(function* () {
      wx.showLoading({
        title: '提现中...',
        icon: "none"
      })
      let res = yield kkservice.userGetMoney()
      wx.hideLoading()
      if (res && res.data && res.data.code == 1) {
        thiz.data.userInfo.share_money = "0.00"
        thiz.setData({
          userInfo: thiz.data.userInfo
        })
        app.index.setData({
          userInfo: thiz.data.userInfo
        })
        wx.showModal({
          title: '',
          content: res.data.msg ? res.data.msg : "提现成功，请注意查收微信入账通知消息",
          showCancel: false
        })
      } else {
        wx.showToast({
          title: (res.data && res.data.msg) ? res.data.msg : "提现失败",
          icon: "none"
        })
      }
    })
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
  getMoney() {
    let thiz = this
    co(function* () {
      wx.showLoading({
        title: '领取中...',
        icon: "none"
      })
      let res = yield kkservice.userRedBag(app.fid, thiz.user_id)
      wx.hideLoading()
      if (res && res.data && res.data.code == 1) {
        if (res.data.data.status == 0) {
          wx.showToast({
            title: '红包已领取',
            icon: "none"
          })
          return
        }
        thiz.moneyMusicPlay()
        thiz.data.userInfo.share_money = res.data.data.share_money
        thiz.setData({
          userInfo: thiz.data.userInfo
        })
        app.index.setData({
          userInfo: thiz.data.userInfo
        })
        thiz.toogleHb(0)
      } else {
        wx.showToast({
          title: '网络问题，请重试',
          icon: "none"
        })
      }
    })
  },
  loginToGetMoney(res) {
    if (this.data.isLogin) {
      this.getMoney()
      return
    }

    if (res.detail && res.detail.userInfo) {
      this.login(undefined, () => {
        this.getMoney()
      })
    }
  },
  navigateToIndex(e) {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  closeHb() {
    this.toogleHb(0)
  },
  toogleHb(opacity) {
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
      animationDataHb: animation.export(),
      animationDataMaskHb: animationMask.export()
    })
  },
  navigateToRule(e) {
    this.toogleRule(1)
  },
  closeRule() {
    this.toogleRule(0)
  },
  toogleRule(opacity) {
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
      animationDataRule: animation.export(),
      animationDataMaskRule: animationMask.export()
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (!app.formId || app.formId.length == 0) {
      app.formId = wx.getStorageInfoSync("formId")
    }
    let url = "/pages/zlhb/zlhb?id=" + this.data.userInfo.user_id + "&fid=" + app.formId + "&index=1"
    console.log(url)
    return {
      title: app.appInfo.share_title[4],
      imageUrl: app.appInfo.ico[4],
      path: url
    }
  }
})
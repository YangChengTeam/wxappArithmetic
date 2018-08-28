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
    invate_count: 5,
    share_userid: "",
    is_from_share: false,
    ruleList: [],
    animationDataMaskRule: {},
    animationDataRule: {},

    animationDataMaskHb: {},
    animationDataHb: {},
    count: 5,
    isLogin: false,
    isShowContent: false,
    isShowAd: false,
    totalTopHeight: 68,
    bgWidth: 0,
    helpInfo: {},
    wxapplist: [],
    mini: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mini = app.getMini()
    this.setData({
      mini: mini,
      totalTopHeight: app.totalTopHeight
    }) 
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
    if (this.index){
      app.setNavInfo("助力红包", "#d40004", 1, "/pages/index/index")
    } else {
      app.setNavInfo("助力红包", "#d40004", 1)
    }
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
            thiz.toogleHb(1)
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
        thiz.helpInfo = helpInfo
        let bgWidth = (helpInfo.list.length * 0.2)
        let count = thiz.data.invate_count - helpInfo.list.length
        for (let i = helpInfo.list.length; i < thiz.data.invate_count; i++) {
          helpInfo.list.push({})
        }
        wx.stopPullDownRefresh()
        thiz.setData({
          isLogin: true,
          isShowContent: true,
          helpInfo: helpInfo,
          bgWidth: 270 * bgWidth,
          count: count > 0 ? count : 0,
          time: thiz.getLastTime()
        })
        console.log("msg" + helpInfo.msg)
        if (helpInfo.is_get == 0) {
          setTimeout(()=>{
            thiz.toogleHb(1)
          }, 1000)   
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
      thiz.countDowning = true
      thiz.countDown()
      thiz.setData({
        ruleList: ruleList,
        is_from_share: is_from_share,
        wxapplist: appInfo.more_app_info.slice(0, 4)
      })
    })
  },
  previewImg(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.img],
    })
  },
  natiageToPath(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  natiageToMiniProgram(e) {
    console.log(e.currentTarget.dataset.appid)
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
    })
  },
  
  submit(e) {
    app.formId = e.detail.formId
    wx.setStorageSync("formId", app.formId)
    console.log(app.formId)
  },
  onPullDownRefresh: function () {
    let thiz = this
    thiz.isCashing = false
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
        thiz.helpInfo = helpInfo
        let bgWidth = helpInfo.list.length * 0.2
        let count = thiz.data.invate_count - helpInfo.list.length
        for (let i = helpInfo.list.length; i < thiz.data.invate_count; i++) {
          helpInfo.list.push({})
        }

        console.log(bgWidth)
        thiz.setData({
          isLogin: true,
          isShowContent: true,
          helpInfo: helpInfo,
          bgWidth: bgWidth * 270,
          count: count > 0 ? count : 0,
          time: thiz.getLastTime()
        })
        console.log("msg" + helpInfo.msg)

        if (helpInfo.is_get == 0) {
          if (!thiz.isShowHb) {
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
    if (this.isCashing) {
      return
    }
    this.isCashing = true
    if (this.data.helpInfo.status != 1) {
      wx.showModal({
        title: '提现失败',
        content: `还需邀请${this.data.count}位好友完成助力任务！`,
        showCancel: false
      })
      this.isCashing = false
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
        wx.showModal({
          title: '',
          content: (res.data.msg && res.data.msg.length > 0) ? res.data.msg : "提现成功，请注意查收微信入账通知消息",
          showCancel: false
        })
      } else {
        wx.showToast({
          title: (res.data && res.data.msg.length > 0) ? res.data.msg : "提现失败",
          icon: "none"
        })
      }
    })
  },

  getLastTime() {
    let allow_time = this.helpInfo.allow_time
    let hours = parseInt(allow_time / 3600)
    if (hours < 10) {
      hours = "0" + hours
    }
    allow_time -=  3600 * hours
    let minutes = parseInt((allow_time) / 60)
    allow_time -= 60 * minutes
    if (minutes == 0) {
      minutes = 59
      if(hours > 0){
        hours -= 1
      }
    }
    else if (minutes < 10) {
      minutes = "0" + minutes
    }
    
    let seconds = parseInt((allow_time))

    if (seconds == 0) {
      seconds = 59
      if (minutes > 0){
         minutes -= 1
      }
    }
    else if (seconds < 10) {
      seconds = "0" + seconds
    }


    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds
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
        thiz.toogleHb(0)
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
      } else {
        wx.showToast({
          title: '网络问题，请重试',
          icon: "none"
        })
      }
    })
  },
  onHide() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  countDown() {
    let thiz = this
    thiz.timer = setInterval(() => {
      thiz.helpInfo.allow_time -= 1
      if (thiz.helpInfo.allow_time < 0) {
        clearInterval(thiz.timer)
        return
      }
      thiz.setData({
        time: thiz.getLastTime()
      })
    }, 1000)
  },
  loginToGetMoney(res) {
    let thiz = this
    thiz.isShowHb = true

    if (thiz.data.isLogin) {
      thiz.getMoney()
      return
    }

    if (res.detail && res.detail.userInfo) {
      this.login(undefined, () => {
        thiz.getMoney()
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
    let url = "/pages/zlhb/zlhb?id=" + app.userInfo.user_id + "&fid=" + app.formId + "&index=1"
    return {
      title: app.appInfo.share_title[2],
      imageUrl: app.appInfo.ico[2],
      path: url
    }
  },
  onShow(e) {
    if (!this.timer && this.countDowning){
        this.countDown()
    }
  }
})
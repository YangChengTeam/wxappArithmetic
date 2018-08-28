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
    mini: 0,
    animationData: {}
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
    let scale = 1.04
    this.scaleTimer  = setInterval((() => {
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      })
      animation.scale(scale, scale).step()
      this.setData({
        animationData: animation.export()
      })
      if (scale > 1.0) {
        scale = 1.0
      } else {
        scale = 1.04
      }
      
    }).bind(this), 1000)

  },
  loadData(options) {
    this.index = options && options.index ? options.index : ""
    this.user_id = options && options.id ? options.id : ""
    app.fid = options && options.fid ? options.fid : ""
    console.log("user_id:" + this.user_id)
    console.log("fid:" + app.fid)
    let is_from_share = this.index == 1 ? true : false
    let thiz = this
    if (this.index) {
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
          setTimeout(() => {
            thiz.toogleHb(1)
          }, 1000)
        } else {
          thiz.countDowning = true
          thiz.countDown()
          if (helpInfo.msg) {
            setTimeout(() => {
              wx.showModal({
                title: '',
                content: helpInfo.msg,
                showCancel: false
              })
            }, 1000)
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
        wxapplist: appInfo.more_app_info.slice(0, 4),
        index: thiz.index
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
    console.log('onPullDownRefresh')
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
          count: count > 0 ? count : 0,
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
            thiz.countDowning = true
            thiz.countDown()
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
  cashMoney(e){
    if (this.isCashing) {
      return
    }
    this.isCashing = true
    let thiz = this
    if (this.data.helpInfo.status != 1) {
      wx.showModal({
        title: '提现失败',
        content: `还需邀请${this.data.count}位好友完成助力任务！`,
        showCancel: false
      })
      this.isCashing = false
      return
    }
    wx.showModal({
      title: '',
      content: '是否提现',
      cancelText: "取消",
      success(res) {
         thiz.isCashing = false
          if(res.confirm){
            thiz.caseMoney()
          }
      }
    })
  },
  caseMoney(e) {
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
    allow_time -= 3600 * hours

    let minutes = parseInt(allow_time / 60)

    if (minutes == 0) {
      if (hours > 0) {
        hours -= 1
        minutes = 59
        if (hours < 10) {
          hours = "0" + hours
        }
      }
    }
    if (minutes < 10) {
      minutes = "0" + minutes
    }

    allow_time -= 60 * minutes

    let seconds = allow_time

    if (seconds == 0) {
      this.helpInfo.allow_time -= 1
      if (minutes > 0) {
        minutes -= 1
        seconds = 59
        if (minutes < 10) {
          minutes = "0" + minutes
        }
      }
    }
    if (seconds < 10) {
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
        thiz.countDowning = true
        thiz.countDown()
        thiz.moneyMusicPlay()
        let helpInfo = yield kkservice.userHelp();
        helpInfo = helpInfo.data.data
        let count = thiz.data.invate_count - helpInfo.list.length
        for (let i = helpInfo.list.length; i < thiz.data.invate_count; i++) {
          helpInfo.list.push({})
        }
        thiz.setData({
          helpInfo: helpInfo,
          count: count
        })
      } else {
        wx.showToast({
          title: '网络问题，请重试',
          icon: "none"
        })
      }
    })
  },
  clear(){
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
    }
    if (this.taskTimer) {
      clearInterval(this.taskTimer)
      this.taskTimer = undefined
    }
  },
  onHide() {
    this.clear()
  },
  onUnload(e){
    this.clear()
    if (this.scaleTimer ) {
      clearInterval(this.scaleTimer )
      this.scaleTimer  = undefined
    }
  },
  countDown() {
    let thiz = this
    this.timer = setInterval(() => {
      thiz.helpInfo.allow_time -= 1
      if (thiz.helpInfo.allow_time < -1) {
        clearInterval(thiz.timer)
        wx.showModal({
          title: '',
          content: '助力任务超时，请重新开始！',
          showCancel: false,
          complete(){
            co(function* () {
              let helpInfo = yield kkservice.userHelp()
              helpInfo = helpInfo.data.data
              thiz.helpInfo = helpInfo
              let bgWidth = helpInfo.list.length * 0.2
              thiz.countDown()
              let count = thiz.data.invate_count - helpInfo.list.length
              for (let i = helpInfo.list.length; i < thiz.data.invate_count; i++) {
                helpInfo.list.push({})
              }
              thiz.setData({
                helpInfo: helpInfo,
                time: thiz.getLastTime(),
                count: count,
                bgWidth: 270 * bgWidth
              })
            })
          }
        })
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
    if (!this.timer && this.countDowning) {
      this.countDown()
    }
    if (!this.taskTimer) {
      this.task()
    }

    
  },
  task() {
    let timer = 1000 * 20
    let thiz = this
    thiz.taskTimer = setInterval(() => {
      timer = 1000 * 10
      co(function* () {
        let helpInfo = yield kkservice.userHelp()
        helpInfo = helpInfo.data.data
        if (helpInfo.list.length == 0) return
        let count = thiz.data.invate_count - helpInfo.list.length
        let bgWidth = helpInfo.list.length * 0.2
        for (let i = helpInfo.list.length; i < thiz.data.invate_count; i++) {
          helpInfo.list.push({})
        }
        thiz.setData({
          helpInfo: helpInfo,
          count: count,
          bgWidth: 270*bgWidth
        })
      })
    }, timer)
  }
})
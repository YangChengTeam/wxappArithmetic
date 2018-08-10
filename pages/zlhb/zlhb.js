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
    share_userid: "",
    is_from_share: false,
    is_get_money: false,
    ruleList: [],
    animationDataMaskRule: {},
    animationDataRule: {},
    count: 2,
    userInfo: {
      share_money: 0.00
    },
    isLogin: false,
    isShowContent: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData(options)
  },
  loadData(options){
    this.user_id = options && options.id ? options.id : ""
    console.log("user_id:" + this.user_id)
    let is_from_share = this.user_id.length > 0 ? true : false
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
        let helpInfo = yield kkservice.userHelp(thiz.user_id)
        helpInfo = helpInfo.data.data
        let count = 2 - helpInfo.list.length
        console.log(helpInfo.list)
        for (let i = helpInfo.list.length; i < 2; i++) {
          helpInfo.list.push({})
        }
        wx.stopPullDownRefresh()
        thiz.setData({
          isLogin: true,
          userInfo: userInfo,
          isShowContent: true,
          helpInfo: helpInfo,
          is_get_money: helpInfo.is_get ? true : false,
          count: count > 0 ? count : 0

        })
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
  onPullDownRefresh: function () {
    let thiz = this
    thiz.refreshing = true
    thiz.loadData({id: thiz.user_id})
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
        let [userInfo, helpInfo] = [yield kkservice.getUserInfo(), yield kkservice.userHelp(thiz.user_id)]
        wx.stopPullDownRefresh()
        userInfo = userInfo.data.data
        helpInfo = helpInfo.data.data
        let count = 2 - helpInfo.list.length
        for (let i = helpInfo.list.length; i < 2; i++) {
          helpInfo.list.push({})
        }
        thiz.setData({
          isLogin: true,
          userInfo: userInfo,
          isShowContent: true,
          helpInfo: helpInfo,
          is_get_money: helpInfo.is_get ? true : false,
          count : count > 0 ? count : 0
        })
        
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
  caseMoney(){
    console.log(this.data.helpInfo.status)
    if (this.data.helpInfo.status != 1){
      this.toogleRule(1)
      return
    }
    let thiz = this
    co(function*(){
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
          wx.showModal({
            title: '',
            content: res.data.msg,
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
  getMoney(){
     let thiz = this
     co(function*(){
       wx.showLoading({
         title: '领取中...',
         icon: "none"
       })
       let res = yield kkservice.userRedBag(thiz.user_id)
       wx.hideLoading()
       if(res && res.data && res.data.code == 1){
          thiz.data.userInfo.share_money = res.data.data.share_money
          thiz.setData({
              is_get_money: true,
              userInfo: thiz.data.userInfo
          })
       }
     })
  },
  loginToGetMoney(res){
    if(this.data.isLogin){
       this.getMoney()
       return
    }

    if (res.detail && res.detail.userInfo) {
      this.login(undefined, ()=>{
         this.getMoney()
      })
    }
  },
  navigateToIndex(e) {
    wx.redirectTo({
      url: '/pages/index/index',
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
  onShareAppMessage: function() {
      let url = "/pages/zlhb/zlhb?id=" + this.data.userInfo.user_id
      console.log(url)
      return {
         title: app.appInfo.share_title[4],
        imageUrl: app.appInfo.more_app_info[4],
         path: url
      }
  }
}) 
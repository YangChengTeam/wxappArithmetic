//index.js
//获取应用实例
const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")

Page({
  data: {
    gameStart_animationData: {},
    rank_animationData: {},
    prize_animationData: {},
    invateFriend_animationData: {},
    more_animationData: {},
    rule_animationData: {},
    userInfo: {
      money: 0,
      played_num: 0 ,
      total_num: 0 },
    isLogin: false
  },
  onLoad: function () {  
     let thiz = this
     app.index = this
     co(function*(){
          var status = yield kkservice.authPermission("scope.userInfo")
          if (status == kkconfig.status.authStatus.authOK){
              thiz.login()
          }
     })
  },
  
  login(url, callback){
    if(this.data.isLogin){  
      if (url) {
        wx.navigateTo({
          url: url,
        })
      }
      return
    }
    let thiz = this
    co(function* () {
      wx.showLoading({
          title: '正在登录...',
      })
      if (yield kkservice.login()) {
        let userInfo = yield kkservice.getUserInfo()
        kkconfig.global.userInfo = userInfo.data.data
        kkconfig.global.userInfo.money = parseInt(kkconfig.global.userInfo.money)
        thiz.setData({
          isLogin: true,
          userInfo: userInfo.data.data
        })
        if(url){
          wx.navigateTo({
            url: url,
          })
        }
        wx.hideLoading()
        if(callback){
           callback()
        }
      }
    })
  },
  doLogin(res){
     let thiz = this
     if(res.detail && res.detail.userInfo){
         thiz.login()
     }
  },
  loginToStart(res){
    let thiz = this
    if (res.detail && res.detail.userInfo) {
      thiz.login('/pages/start/start')
    }
  },
  navigateToRank() {
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  },
  navigateToPrize() {
    wx.navigateTo({
      url: '/pages/prize/prize',
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
  action(e, s){
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
  }
  ,
  start(e){
     this.action(e, 0.8)
  },
  end(e){
     this.action(e, 1.0)
  }
})

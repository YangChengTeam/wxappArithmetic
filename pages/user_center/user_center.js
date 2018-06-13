// pages/user_center/user_center.js
//获取应用实例
const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationDataSign: {},
    animationDataMaskSign: {},
    moreList: [],
    userInfo: {
      money: 0,
      played_num: 0,
      playable_num: 0
    },
    signInfo: {},
    isShowContent: false,
    status: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var thiz = this
    this.setData({
        status: app.index.appInfo.data.data.status
    })
    co(function* () {
      var appInfo = app.index.appInfo
      var signInfo = app.index.signInfo
      wx.hideLoading()
      thiz.setData({
        isLogin: true,
      }, ()=>{
        thiz.setData({
          moreList: appInfo.data.data.more_app_info,
          userInfo: app.index.data.userInfo,
          signInfo: signInfo
        })
      })
      
      setTimeout(()=>{
         thiz.setData({
           isShowContent: true
         })
      }, 1000)
    })
  },
  open(e){
     let appid = e.currentTarget.dataset.appid
     wx.navigateToMiniProgram({
       appId: appid,
     })
  },
  navigateToRule() {
    wx.navigateTo({
      url: '/pages/rule/rule',
    })
  },
  openSign(){
    this.toogleSign(1.0)
  },
  closeSign(){
    this.toogleSign(0)
  },
  toogleSign(opacity){
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
  signIn(e) {
    let thiz = this
    app.index.signIn(e, (signInfo, userInfo)=>{
      thiz.setData({
        signInfo: signInfo,
        userInfo: userInfo
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (shareRes) {
    let thiz = this
    return app.index.commonShare(shareRes, app.index.appInfo.data.data.share_title[0], app.index.appInfo.data.data.ico[0], (iv, ed) => {
      app.index.shareSucc(iv, ed, (u) => {
        if(u){
          thiz.setData({
              userInfo: u
          })
        }
      }, 0)
    })
  }
})
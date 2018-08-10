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
    status: 1,
    cashTip: '',
    mini: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.user_center = this
    app.index.isStart = false
    wx.showShareMenu({
      withShareTicket: true
    })
    try {
      var res = wx.getSystemInfoSync()
      this.setData({
          mini: app.compareVersion(res.SDKVersion, '2.0.7')
      })
    } catch (e2) {
    }
    var thiz = this
    this.setData({
      status: app.index.data.appInfo.status
    })
    co(function*() {
      var appInfo = app.index.data.appInfo
      wx.hideLoading()
      if (parseFloat(app.index.data.userInfo.allow_change_money) > parseFloat(app.index.data.userInfo.money)) {
        thiz.data.cashTip = `最低提现金额为${app.index.data.userInfo.allow_change_money}元`
      } else {
        thiz.data.cashTip = `满${app.index.data.userInfo.allow_change_money}元可提现`
      }
      thiz.setData({
        isLogin: true,
      }, () => {
        thiz.setData({
          moreList: appInfo.more_app_info,
          userInfo: app.index.data.userInfo,
          cashTip: thiz.data.cashTip
        })
      })
      setTimeout(() => {
        thiz.setData({
          isShowContent: true
        })
      }, 1000)
    })
  },
  open(e) {
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
  openTakeMoneyRecord() {
    wx.navigateTo({
      url: '/pages/money-record/moneyRecord',
    })
  },
  previewImg(e){
     wx.previewImage({
       urls: [e.currentTarget.dataset.img],
     })
  },
  navigateToComplain() {
    wx.navigateTo({
      url: '/pages/complain/complain',
    })
  },

  natiageToMiniProgram(e) {
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
    })
  },
  navigateToCash(e) {
    wx.navigateTo({
      url: '/pages/cash/cash',
    })
  }
})
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
    app.index.isStart = false
    wx.showShareMenu({
      withShareTicket: true
    })
    try {
      var res = wx.getSystemInfoSync()
      this.setData({
          mini: this.compareVersion(res.SDKVersion, '2.0.7')
      })
    } catch (e2) {
    }
    var thiz = this
    this.setData({
      status: app.index.appInfo.data.data.status
    })
    co(function*() {
      var appInfo = app.index.appInfo
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
          moreList: appInfo.data.data.more_app_info,
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
  natiageToMiniProgram(e) {
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
    })
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
  }
  ,
  navigateToCash(e) {
    wx.navigateTo({
      url: '/pages/cash/cash',
    })
  },
  onShareAppMessage: function(shareRes) {
    let thiz = this
    return app.index.commonShare(shareRes, app.index.appInfo.data.data.share_title[0], app.index.appInfo.data.data.ico[0], (iv, ed) => {
      app.index.shareSucc(iv, ed, (u) => {
        if (u) {
          thiz.setData({
            userInfo: u
          })
        }
      }, -1)
    })
  }
})
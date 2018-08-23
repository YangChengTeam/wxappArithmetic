// pages/cash/cash.js
const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")
const kkpromise = require("../../libs/yc/yc-promise.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationDataSign: {},
    animationDataMaskSign: {},
    userInfo: {

    },
    currentMoney: '',
    code: '',
    ruleList: [],
    cashTip: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let thiz = this
    co(function* () {
      var appInfo = app.index.data.appInfo
      var ruleList = (appInfo.change_money_rule.split('\n'))
      ruleList.forEach((v, k) => {
        ruleList[k] = v.replace(`${k + 1}.`, '')
      })
      if (parseFloat(app.index.data.userInfo.allow_change_money) > parseFloat(app.index.data.userInfo.money)) {
        thiz.data.cashTip = `最低提现金额为${app.index.data.userInfo.allow_change_money}元`
      } else {
        thiz.data.cashTip = `满${app.index.data.userInfo.allow_change_money}元可提现`
      }
      thiz.setData({
        ruleList: ruleList,
        userInfo: app.index.data.userInfo,
        cashTip: thiz.data.cashTip
      })
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  getAllMoney(e) {
    this.setData({
      currentMoney: app.index.data.userInfo.money
    })
  },
  submitCash(e) {
    if(this.isCashing){
       return
    }
    this.isCashing = true
    let money = parseFloat(this.data.currentMoney)
    if (isNaN(money) || parseFloat(money) < 0.01) {
      wx.showToast({
        title: '输入的格式不正确',
        icon: 'none'
      })
      this.isCashing = false
      return
    }
    if (money > parseFloat(app.index.data.userInfo.money)) {
      wx.showToast({
        title: '提现金额大于赏金',
        icon: 'none'
      })
      this.isCashing = false
      return
    }
    money = money.toFixed(2)
    this.setData({
      currentMoney: money
    })
    let thiz = this
    co(function* () {
      wx.showLoading({
        title: '提现中...',
        mask: true
      })
      var res = yield kkservice.changeMoney(money)
      this.isCashing = false
      wx.hideLoading()
      if (res && res.data) {
        if (res.data.code == 1) {
          thiz.setData({
            code: res.data.data.change_code
          })
          thiz.toogleSign(1)
          app.index.data.userInfo.money = res.data.data.f_money
          app.index.setData(
            {
              userInfo: app.index.data.userInfo
            }
          )
          app.user_center.setData({
            userInfo: app.index.data.userInfo
          })
          return
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },
  navigateToCaseRecord(e) {
    wx.navigateTo({
      url: '/pages/cash-record/cashRecord',
    })
  },
  copyCode(e) {
    wx.setClipboardData({
      data: this.data.code,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        })
      }
    })
  },
  checkMoney(e) {
    this.data.currentMoney = e.detail.value
  },
  redirectToGame(e) {
    wx.navigateTo({
      url: '/pages/start/start',
    })
  },
  onShow(e) {
    wx.onUserCaptureScreen(function (res) {
      app.screenShot()
    })
  }
})
// pages/cash-record/cashRecord.js
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
    recordList: [],
    isShowContent: false,
    animationDataSign: {},
    animationDataMaskSign: {},
    code: ''
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
  onLoad: function (options) {
    wx.hideShareMenu({})
    var thiz = this
    co(function* () {
      var recordList = yield kkservice.moneyList()
      console.log(recordList)
      thiz.setData({
         recordList: recordList.data.data,
      })
      setTimeout(() => {
        thiz.setData({
          isShowContent: true
        })
      }, 1000)
    })
  },
  getCode(e){
    this.setData({
       code: e.currentTarget.dataset.code
    })
    this.toogleSign(1)
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
  }
})
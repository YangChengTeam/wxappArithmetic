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
    ruleList: [],
    isShowContent: false,
    money_code: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let thiz = this
    this.index = options && options.index ? options.index : ""
    if(this.index){
      app.setNavInfo("", "rgba(0,0,0,0)", 2, "/pages/index/index")
    }else{
      app.setNavInfo("", "rgba(0,0,0,0)", 2)
    }
    co(function*() {
      let [status, res] = yield [kkservice.authPermission("scope.userInfo"), yield kkservice.getAppInfo()]
      let appInfo = res.data.data
      app.appInfo = appInfo
      if (!app.isLogin && status == kkconfig.status.authStatus.authOK) {
        thiz.login()
      }

      let ruleList = (appInfo.change_money_rule.split('\n'))
      ruleList.forEach((v, k) => {
        ruleList[k] = v.replace(`${k + 1}.`, '')
      })

      thiz.setData({
        ruleList: ruleList,
        isShowContent: true
      })

    })
  },
  getMoneyCode(e) {
    this.data.money_code = e.detail.value
  },
  loginToCash(res) {
    let thiz = this
    if (!thiz.data.money_code || thiz.data.money_code.substr(0, 1) != "T" || thiz.data.money_code.length < 17) {
      wx.showModal({
        title: '',
        content: '提现码不正确',
        showCancel: false
      })
      return
    }
    if (app.isLogin) {
      this.submitCash()
      return
    }

    if (res.detail && res.detail.userInfo) {
      thiz.login(() => {
        thiz.submitCash()
      })
    }
  },
  login(callback) {
    let thiz = this
    co(function*() {
      if (!thiz.refreshing) {
        wx.showLoading({
          title: '正在登录...',
        })
      }
      thiz.refreshing = false
      if (yield kkservice.login()) {
        let userInfo = yield kkservice.getUserInfo()
        wx.hideLoading()

        userInfo = userInfo.data.data

        app.userInfo = userInfo
        app.isLogin = true

        if (callback) {
          callback()
        }
      }
    })
  },
  submitCash(e) {
    

    if (this.isCashing) {
      return
    }
    let thiz = this

    this.isCashing = true

    co(function*(res) {
      wx.showLoading({
        title: '提现中...',
        mask: true
      })
      var res = yield kkservice.changeMoney(thiz.data.money_code)
      thiz.isCashing = false
      wx.hideLoading()
      let msg = ''
      if (res && res.data && res.data.code == 1) {
        msg = res.data.msg
        thiz.setData({
          money_code: ""
        })
        wx.showModal({
          title: '',
          content: msg,
          showCancel: false
        })
        return
      } else {
        msg = res && res.data && res.data.msg ? res.data.msg : '网络错误'
      }
      wx.showModal({
        title: '',
        content: msg,
        showCancel: false
      })
    })
  },
  navigateToCaseRecord(e) {
    wx.navigateTo({
      url: '/pages/cash-record/cashRecord',
    })
  },
  redirectToIndex(e) {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})
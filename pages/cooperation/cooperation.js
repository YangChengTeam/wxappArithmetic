// pages/cooperation/cooperation.js
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
    isShowContent: false,
    logoImg: "",
    maImg: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavInfo("合作申请", "#fff", 2)
    setTimeout(() => {
      this.setData({
        isShowContent: true
      })
    }, 300)
  },
  upLogo(e) {
    let index = e.currentTarget.dataset.index
    let thiz = this

    co(function* () {
      let res = yield kkpromise.chooseImage()
      var tempFilePaths = res.tempFilePaths
      if (index == 1) {
        thiz.setData({
          logoImg: tempFilePaths[0]
        })

      } else if (index == 2) {
        thiz.setData({
          maImg: tempFilePaths[0]
        })
      }
      wx.showLoading({
        title: '上传中...',
        mask: true
      })
      res = yield kkservice.appCooperateImg(tempFilePaths[0])
      wx.hideLoading()
      let data = (JSON.parse(res.data))

      if (index == 1) {
        thiz.ico1 = data.data.ico
      }
      else if (index == 2) {
        thiz.ico2 = data.data.ico
      }
    })
  },
  inputName(e) {
    this.name = e.detail.value
  },
  inputIntroduction(e) {
    this.introduction = e.detail.value
  },
  inputWxapp(e) {
    this.wxapp = e.detail.value
  },
  inputAppid(e) {
    this.appid = e.detail.value
  },
  inputPath(e) {
    this.path = e.detail.value
  },
  submitInfo() {
    let thiz = this
    
    if (!this.name || this.name.length < 2) {
      wx.showToast({
        title: '游戏名称少于2个字',
        icon: 'none'
      })
      return
    }

    if (!this.introduction || this.introduction.length < 5) {
      wx.showToast({
        title: '简介不能少于5个字',
        icon: 'none'
      })
      return
    }

    if (!this.wxapp || this.introduction.wxapp == 0) {
      wx.showToast({
        title: '微信号不能为空',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '提交中...',
      mask: true
    })

    co(function* () {
      let res = yield kkservice.appCooperate({
        name: thiz.name,
        desc: thiz.introduction,
        weixin: thiz.wxapp,
        url: thiz.path,
        app_id: thiz.appid,
        ico: thiz.ico1 + "," + thiz.ico2
      })
      wx.hideLoading()
      let msg = ""
      console.log(res.data)
      if (res && res.data && res.data.code == 1) {
        msg = res.data.data.msg
        wx.showModal({
          title: '',
          content: msg ? msg : '提交申请成功',
          showCancel: false,
          complete() {
            wx.navigateBack({

            })
          }
        })
        return
      } else {
        msg = res.data.msg
      }
      wx.showModal({
        title: '',
        content: msg ? msg : '网络错误',
        showCancel: false
      })
    })
  }
})
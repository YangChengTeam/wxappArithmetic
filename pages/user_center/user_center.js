// pages/user_center/user_center.js
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
    moreList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiz = this
    co(function* () {
      wx.showLoading({
        title: '正在加载...',
      })
      var appInfo = yield kkservice.getAppInfo()
      thiz.setData({
          moreList: appInfo.data.data.more_app_info
      })
      wx.hideLoading()
    })
  },
  open(e){
     let appid = e.currentTarget.dataset.appid
     console.log(appid)
     wx.navigateToMiniProgram({
       appId: appid,
     })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: "pages/index/index"
    }
  }
})
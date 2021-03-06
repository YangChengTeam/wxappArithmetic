// pages/complain/complain.js

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
     title: ''
  },
  check(e){
    this.data.title = e.detail.value
  },
  complain(res){
     let thiz = this
     if(app.index.data.isLogin){ 
        if (thiz.data.title == '') {
          wx.showModal({
            title: '',
            content: '请选择一项投诉内容',
            showCancel: false
          })
          return
        }
        co(function* () {
          wx.showLoading({
            title: '正在提交',
            mask: true
          })
          yield kkservice.complain(thiz.data.title)
          wx.showModal({
            title: '',
            content: '投诉成功',
            showCancel: false,
            complete(){
                wx.navigateBack({})
            }
          })
          wx.hideLoading()
          
        })
     }

     co(function* () {
       var status = yield kkservice.authPermission("scope.userInfo")
       if (status == kkconfig.status.authStatus.authOK) {
         app.index.login(undefined, () => {
           thiz.complain(res)
         })
       } else{
          wx.showModal({
            title: '',
            content: '未授权【获得你的公开信息(昵称、头像等)】不能投诉',
            showCancel: false
          })
       }
     })
   
     
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({})
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
      title: app.index.shareTitle,
      path: "pages/index/index"
    }
  }
})
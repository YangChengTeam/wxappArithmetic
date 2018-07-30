// pages/openmoney/openmoney.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     avatarImg: '',
     money: 0.0
  },
  startGame(e){
     wx.redirectTo({
       url: '/pages/start/start',
     })
  },
  navigateToCash(e) {
    wx.redirectTo({
      url: '/pages/cash/cash',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.hideShareMenu({
        
      })
      this.setData({
         avatarImg: app.index.data.userInfo.face,
         money: app.money
      })
  }
})
// pages/start/start.js
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkpromise = require('../../libs/yc/yc-promise.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNumber: 4,
    animationData3: {},
    animationData2: {},
    animationData1: {},
    animationStart: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
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
    var thiz = this
    var animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation3 = animation3
    animation3.scale(0.5, 0.5).step()
    animation3.opacity(0).step()

    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation2 = animation2
    animation2.scale(0.5, 0.5).step()
    animation2.opacity(0).step()

    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation1 = animation1
    animation1.scale(0.5, 0.5).step()
    animation1.opacity(0).step()

    var animation0 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation0 = animation0
    animation0.scale(0.5, 0.5).step()
    animation0.opacity(0).step()

    setTimeout(() => {
      thiz.setData({
        currentNumber: 3
      }, () => {
        thiz.setData({
          animationData3: thiz.animation3.export()
        })
      })
    }, 500)

    setTimeout(()=>{
      thiz.setData({
        currentNumber: 2
      }, () => {
        thiz.setData({
          animationData2: thiz.animation2.export()
        })
      })
    }, 1800)

    setTimeout(() => {
      thiz.setData({
        currentNumber: 1
      }, () => {
        thiz.setData({
          animationData1: thiz.animation1.export()
        })
      })
    }, 3130)

    setTimeout(() => {
      thiz.setData({
        currentNumber: 0
      }, () => {
        thiz.setData({
          animationStart: thiz.animation0.export()
        })
      })
    }, 3700)
  
    
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
  
  }
})
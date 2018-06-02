// pages/prize/prize.js

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
    currentNumber: 0,
    currentIndex: 0,
    prizeList: [],
    prizeRecordList: [],
    animationDataMaskContact:{},
    animationDataContact: {},
    changeInfo: {}
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
        var [prizeList, prizeRecordList] = yield [kkservice.getPrizeList(), kkservice.getPrizeRecordList()]
        console.log(prizeList)
        thiz.setData({
          prizeList: prizeList.data.data,
          prizeRecordList: prizeRecordList.data.data
        })
        wx.hideLoading()
      })
  },
  loadPrizeRecordList(){
    var thiz = this
    co(function*(){
      var prizeRecordList = yield kkservice.getPrizeRecordList()
      thiz.setData({
        prizeRecordList: prizeRecordList.data.data
      })
    })
  },
  switchPage(e) {
    this.setData({
      currentNumber: e.detail.current
    })
  },

  tabPage(e) {
    let index = e.target.dataset.index
    this.setData({
      currentNumber: index,
      currentIndex: index
    })
  },

  excahngePrize(e){
    let thiz = this
    let id = e.currentTarget.dataset.id
    let money = e.currentTarget.dataset.money
    if (app.index.data.isLogin) {
      if (kkconfig.global.userInfo.money < money) {
        wx.showModal({
          title: '',
          content: '挑战币不足',
          showCancel: false
        })
        return
      }
      wx.showModal({
        title: '',
        content: `是否确定兑换?`,
        success(res){ 
           if(res.confirm){
             thiz.data.changeInfo.id = id
             thiz.data.changeInfo.money = money
             thiz.toogleContact(1)
           }
        }
      })
      return
    }
    app.index.login(undefined, ()=>{
       thiz.excahngePrize(e)
    })
   
  },
  inputName(e){
    this.data.changeInfo.name = e.detail.value
  },
  inputContact(e) {
    this.data.changeInfo.contact = e.detail.value
  },
  inputAddress(e) {
    this.data.changeInfo.address = e.detail.value
  },
  submit(){
    let thiz = this

    if (!this.data.changeInfo.name || this.data.changeInfo.name.trim().length < 2) {
      wx.showModal({
        title: '',
        content: '收货人姓名填写不正确',
        showCancel: false
      })
      return
    }
    if (!this.data.changeInfo.contact || this.data.changeInfo.contact.trim().length < 8) {
      wx.showModal({
        title: '',
        content: '收货人联系方式填写不正确',
        showCancel: false
      })
      return
    }
    if (!this.data.changeInfo.address || this.data.changeInfo.address.trim().length < 8) {
      wx.showModal({
        title: '',
        content: '收货人地址填写不正确',
        showCancel: false
      })
      return
    }
    co(function* () {
      wx.showLoading({
        title: '正在提交...',
        mask: true
      })
      let changeData = yield kkservice.changeGift(thiz.data.changeInfo)
      wx.hideLoading()
      if (changeData && changeData.data && changeData.data.code == 1) {
        kkconfig.global.userInfo.money -= thiz.data.changeInfo.money
        app.index.setData({
          userInfo: kkconfig.global.userInfo
        })
        wx.showModal({
          title: '',
          content: '恭喜您兑换成功,请联系客服寄送娃娃',
          showCancel: false,
          complete(){
            thiz.toogleContact(0)
            thiz.loadPrizeRecordList();
          }
        })

      } else {
        wx.showModal({
          title: '',
          content: changeData.data.msg,
          showCancel: false
          
        })
      }
      
    })
  },
  closeContact(){
    this.toogleContact(0)
  },
  toogleContact(opacity) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.animation.opacity(opacity).top(opacity == 0 ? "-100%" : 0).step()

    var animationMask = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
    })
    this.animationMask = animationMask
    this.animationMask.opacity(opacity).top(opacity == 0 ? "-100%" : 0).step()
    this.setData({
      animationDataContact: animation.export(),
      animationDataMaskContact: animationMask.export()
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
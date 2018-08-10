// pages/money-record/moneyRecord.js
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
    animationDataSucc: {},
    animationDataMaskSucc: {},
    avatarImg: '',
    "type": 2 
  },
  closeSucc() {
    this.toogleSucc(0)
  },
  toogleSucc(opacity) {
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
      animationDataSucc: animation.export(),
      animationDataMaskSucc: animationMask.export()
    })
  },
  onLoad: function (options) {
    wx.hideShareMenu({})
    console.log(app.index.data.userInfo)

    var thiz = this
    co(function* () {
      var recordList = yield kkservice.redBagList()
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
  getMoney(e){
    app.listindex = e.currentTarget.dataset.index
    app.id = e.currentTarget.dataset.id
    app.money = e.currentTarget.dataset.money
    app.type = e.currentTarget.dataset.type
    this.setData({
       avatarImg: app.index.data.userInfo.face,
       "type": app.type
    })
    this.toogleSucc(1)
  },
  playMusic(src) {    
    const innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext = innerAudioContext
    this.innerAudioContext.volume = 1
    innerAudioContext.src = src
    innerAudioContext.play()
  },
  moneyMusicPlay() {
    this.playMusic('/assets/audio/money.mp3')
  },
  navagateToPrizee(){ 
     let thiz = this
     co(function*(){
       wx.showLoading({
         title: '领取中...',
         mask: true
       })
       let res = yield kkservice.getRedBag(app.id, app.formId)
       wx.hideLoading()
       if(res && res.data){     
          if(res.data.code == 1){
            thiz.moneyMusicPlay() 
            app.mtype = 1
            app.index.data.userInfo.money = res.data.data.f_money
            app.index.setData({
                userInfo: app.index.data.userInfo
            })
            app.user_center.setData({
                userInfo: app.index.data.userInfo
            })
            thiz.data.recordList[app.listindex].status = 1
            thiz.setData({
              recordList: thiz.data.recordList
            }) 
            thiz.toogleSucc(0)
            wx.navigateTo({
              url: '/pages/openmoney/openmoney',
            }) 
          } else {
             wx.showToast({
               title: res.data.msg,
               icon: 'none'
             })
          }
       }
     })
  }
})
// pages/start/start.js
//获取应用实例

const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkgen = require('../../libs/yc/yc-arithmetic-gen.js')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")

var questions = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count : 40,
    animationData3: {},
    animationData2: {},
    animationData1: {},
    animationDataStart: {},
    gameAnimationDataGameStart: {},
    timeAnimationDataGameStart: {},
    animationDataStartDesp:{},
    animationDataSelect: {},
    animationDataRight: {},
    animationDataError: {},
    animationDataSucc: {},
    animationDataFail: {},
    animationDataMaskSucc: {},
    animationDataMaskFail: {},
    animationDataProcess: {},

    musicStatus: "on",

    questionInfo: {},
    currentIndex: 0,
    rightNumber: 0,

    isOver: false
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
    questions = kkgen.genQuestionInfos(this.data.count)
    this.setData({
        questionInfo: questions[0]
    })
    this.countdownAnimate()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.musicStatus == "off"){
      this.data.musicStatus = "on"
      this.backgroundMusicPlay()
    }
  },
  playMuisc(){
    if (this.innerAudioContext) {
      this.innerAudioContext.play()
    }
  },
  pauseMusic(){
    if (this.innerAudioContext) {
      this.innerAudioContext.pause()
    }
  },
  stopMusic(){
    if (this.innerAudioContext) {
      this.innerAudioContext.stop()
    }
  },
  playMusic(src, loop = false){
      if (this.data.musicStatus != "on"){
          this.stopMusic()
          return
      }
      const innerAudioContext = wx.createInnerAudioContext()
      if(loop){
        this.loopInnerAudioContext = innerAudioContext
      }else{
        this.innerAudioContext = innerAudioContext
      }
      innerAudioContext.src = src
      innerAudioContext.loop = loop
      innerAudioContext.play()
  },
  coutedownMusicPlay(){
     this.playMusic('/assets/audio/coutedown.wav')
  },
  readygoMusicPlay(){
     this.playMusic('/assets/audio/readygo.wav')  
  },
  backgroundMusicPlay(){
     this.playMusic('/assets/audio/background.wav', true) 
  }, 
  rightMusicPlay() {
    this.playMusic('/assets/audio/right.wav')
  },
  errorMusicPlay() {
    this.playMusic('/assets/audio/error.wav')
  },
  failMusicPlay() {
    setTimeout(() => { this.playMusic('/assets/audio/fail.wav')}, 500)
  },
  countdownAnimate(){
    var thiz = this
    var animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation3 = animation3
    animation3.opacity(1).scale(0.5).step()
    animation3.opacity(0).step()

    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation2 = animation2
    animation2.opacity(1).scale(0.5).step()
    animation2.opacity(0).step()

    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation1 = animation1
    animation1.opacity(1).scale( 0.5).step()
    animation1.opacity(0).step()

    var animationDataStart = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animationDataStart = animationDataStart
    animationDataStart.opacity(1).scale(0.4).step()
    animationDataStart.opacity(0).step()

    var gameAnimationDataGameStart = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.gameAnimationDataGameStart = gameAnimationDataGameStart
    gameAnimationDataGameStart.opacity(1).top(0).step()

    var timeAnimationDataGameStart = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.timeAnimationDataGameStart = timeAnimationDataGameStart
    timeAnimationDataGameStart.top(-685).opacity(0).step()

  
    var animationDataStartDesp = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })
    this.animationDataStartDesp = animationDataStartDesp
    animationDataStartDesp.opacity(0).step()

    var animationDataSelect = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animationDataSelect = animationDataSelect
    animationDataSelect.opacity(1).top(0).step()
    
    setTimeout(() => {
      this.coutedownMusicPlay()
      thiz.setData({
        animationData3: thiz.animation3.export()
      })
    }, 500)

    setTimeout(() => {
      thiz.setData({
        animationData2: thiz.animation2.export()
      })
    }, 1500)

    setTimeout(() => {
      thiz.setData({
        animationData1: thiz.animation1.export()
      })
    }, 2500)

    setTimeout(() => {
      thiz.setData({
        animationDataStart: thiz.animationDataStart.export()
      })
      this.readygoMusicPlay()
    }, 3500)

    setTimeout(() => {
      thiz.setData({
        gameAnimationDataGameStart: thiz.gameAnimationDataGameStart.export(),
        timeAnimationDataGameStart: thiz.timeAnimationDataGameStart.export(),
        animationDataSelect: thiz.animationDataSelect.export(),
        animationDataStartDesp: thiz.animationDataStartDesp.export(),
      })
    }, 4500)

    setTimeout(()=>{
      this.backgroundMusicPlay()
    }, 5500)
  },
  invisiable(){
    this.data.musicStatus = "off"
    this.stopMusic();
    if (this.loopInnerAudioContext) {
      this.loopInnerAudioContext.stop()
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      this.invisiable()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
      this.invisiable()
  },
  action(e, s) {
    var index = e.currentTarget.dataset.index
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.scale(s, s).step()
    if (index == 0) {
      this.setData({
        animationDataRight: this.animation.export()
      })
    } else if (index == 1) {
      this.setData({
        animationDataError: this.animation.export()
      })
    }
  }
  ,
  start(e) {
    this.action(e, 0.8)
  },
  end(e) {
    this.action(e, 1.0)
  },
  right(e){
    if (this.data.isOver) {
      return
    }
    if (this.data.questionInfo.isRight) {
      this.succ()
    } else {
      this.fail()
    }
  },
  error(e){
    if (this.data.isOver) {
        return
    }
    if (!this.data.questionInfo.isRight) {
      this.succ()
    } else {
      this.fail()
    }
  },
  fail(){
    this.isfail= true
    let thiz = this
    this.data.isOver = true    
    this.resetCountDown()
    this.errorMusicPlay()
    this.toogleFail(1)
    this.failMusicPlay();
    co(function* () {
      let postData = yield kkservice.postScore(thiz.data.rightNumber, 0)
        if (postData.data.code == 1) {
           kkconfig.global.userInfo.played_num = postData.data.data.played_num
           kkconfig.global.userInfo.total_num += 1
           app.index.setData({
             userInfo: kkconfig.global.userInfo
           })
        }
    })
  },
  succ(){
    let thiz = this
    this.resetCountDown()
    this.rightMusicPlay()
    if (this.data.currentIndex == this.data.count - 1){
        this.issucc = true
        this.data.isOver = true
        co(function *(){
          let postData = yield kkservice.postScore(thiz.data.rightNumber, 1)
           if(postData.data.code == 1){
              kkconfig.global.userInfo.money = postData.data.data.money
              kkconfig.global.userInfo.total_num += 1
              app.index.setData({
                 userInfo: kkconfig.global.userInfo
              })
              thiz.setData({ rightNumber: ++thiz.data.rightNumber })
              thiz.toogleSucc(1)
           }
        })
        return
    }
    this.setData({
      rightNumber: ++this.data.rightNumber,
      currentIndex: ++this.data.currentIndex,
      questionInfo: questions[this.data.currentIndex]
    }, ()=>{
      this.countDown(this.data.questionInfo)
    })
    
  },
  toogleSucc(opacity){
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
  toogleFail(opacity) {
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
        animationDataFail: animation.export(),
        animationDataMaskFail: animationMask.export()
    })
  },
  continuePlay(e){
    wx.redirectTo({
      url: 'start',
    })
  },
  closeFail(e){
    this.toogleFail(0)
    wx.navigateBack({
      
    })
  },
  closeSucc(e) {
    this.toogleFail(0)
    wx.navigateBack({})
  },
  navagateToPrizee(){
    wx.redirectTo({
      url: '/pages/prize/prize',
    })
  },
  countDown(questionInfo){
    var t = questionInfo.t * 1000;
    var animation = wx.createAnimation({
      duration: t,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.width(0).step()
    this.setData({
        animationDataProcess: animation.export()
    })

    this.timer = setTimeout(()=>{
       this.fail()
    }, t)
  },
  resetCountDown(){
    if (this.timer) {
      clearTimeout(this.timer)
    }
    var animation = wx.createAnimation({
      duration: 0
    })
    this.animation = animation
    animation.width("100%").step()
    this.setData({
      animationDataProcess: animation.export()
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      let title = '天啦噜，就差一关就能免费领娃娃，你也来试试...'
      if(this.issucc){
        title = '我在「加减挑战赛」闯关成功，免费换了娃娃，你也来试试...'
      }
      return {
        title: title,
        path: "pages/index/index"
      }
  }
})
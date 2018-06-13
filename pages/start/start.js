// pages/start/start.js
//获取应用实例

const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkgen = require('../../libs/yc/yc-arithmetic-gen.js')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")

var questions = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count : 30,
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
    isHelp: false,
    isOver: false,
    isShowContent: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showShareMenu({
          withShareTicket: true
      }) 
  },
  noPlayableNum(){
    if (app.index.data.userInfo.playable_num <= 0) {
      wx.showModal({
        title: '',
        content: '分享到群, 增加挑战机会',
        showCancel: false,
        complete() {
          wx.redirectTo({
            url: '/pages/user_center/user_center',
          })
        }
      })
      return true
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.noPlayableNum()){
       return 
    }
    if (app.index.appInfo.data.data.status != 1){
       this.setData({
          isHelp: true
       })
    }
    let thiz = this
    co(function*(){
       thiz.setData({
          isShowContent: true
       })
       let res = yield kkservice.getQuestionList(thiz.data.count)    
       let t = 16
       if(res.data && res.data.code == 1){
           questions = res.data.data
           questions.forEach((v, i)=>{
              v.t = t - parseInt(i / thiz.data.count)
           })
       }
       for(let i = 0; i< questions[0].options.length;i++){
         questions[0].options[i].name = String.fromCharCode(65 + i) + ". "+ questions[0].options[i].name
       }
       thiz.setData({
         questionInfo: questions[0]
       })
       thiz.countdownAnimate()
    })    
  },
  answer(e){
     if(this.data.isOver) return
     let thiz = this
     let index = (e.currentTarget.dataset.index)
     let option = this.data.questionInfo.options[index]
     if (option.is_answer === 1 ){
        option.style=' snake right'
        option.style2 = ' right2'
        setTimeout(()=>{
          thiz.succ()
        }, 500)
     } else {
        option.style = ' snake error'
        option.style2 = ' error2'
        for (let i = 0;  i < this.data.questionInfo.options.length; i++) {
            if(i == index) continue
            let tmp_option = this.data.questionInfo.options[i]
            if (tmp_option.is_answer === 1){
              tmp_option.style = ' snake right'
              tmp_option.style2 = ' right2'
              break
            }
        }
        setTimeout(() => {
          thiz.fail()
        }, 500)
     }
     this.setData({
       questionInfo: this.data.questionInfo
     })
  },

  help(){
     this.data.isOver = false
     this.setData({
        isHelp: true
     })
     this.lp = 1
     this.succ() 
  },
  fail(){
    let thiz = this
    if (this.data.count - this.data.rightNumber <= 10 || app.index.data.userInfo.playable_num <= 0){
       this.setData({
           isHelp: true
       })
    }  
    this.isfail = true
    this.data.isOver = true    
    this.resetCountDown()
    this.errorMusicPlay()
    this.toogleFail(1)
    this.failMusicPlay()
    co(function* () {
        let postData = yield kkservice.postScore(thiz.data.rightNumber, 0, app.formId, thiz.lp)
        if (postData.data.code == 1) {
          kkconfig.global.userInfo.played_num = postData.data.data.played_num
          kkconfig.global.userInfo.playable_num = postData.data.data.playable_num
          kkconfig.global.userInfo.money = postData.data.data.money
          kkconfig.global.userInfo.total_num += 1
          app.index.setData({
            userInfo: kkconfig.global.userInfo
          })
        }
    })
  },
succ(){
  let thiz = this
  thiz.resetCountDown()
  thiz.rightMusicPlay()
  if (thiz.data.currentIndex >= thiz.data.count - 1) {
    thiz.issucc = true
    thiz.data.isOver = true
    co(function* () {
      let postData = yield kkservice.postScore(thiz.data.rightNumber, 1, app.formId, thiz.lp)
      if (postData.data.code == 1) {
        kkconfig.global.userInfo.played_num = postData.data.data.played_num
        kkconfig.global.userInfo.playable_num = postData.data.data.playable_num
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
  questions[thiz.data.currentIndex].animate = ''
  thiz.setData({
    questionInfo: questions[thiz.data.currentIndex]
  }, () => {
    thiz.countDown(thiz.data.questionInfo)
  })
  setTimeout(() => {
    ++thiz.data.currentIndex
    questions[thiz.data.currentIndex].animate = ' flipInY'
    for (let i = 0; i < questions[thiz.data.currentIndex].options.length; i++) {
      questions[thiz.data.currentIndex].options[i].name = String.fromCharCode(65 + i) + ". " + questions[thiz.data.currentIndex].options[i].name
    }
    thiz.setData({
      rightNumber: ++thiz.data.rightNumber,
      currentIndex: thiz.data.currentIndex,
      questionInfo: questions[thiz.data.currentIndex]
    })
  }, 10)

},
  action(e, s) {
    var index = e.currentTarget.dataset.index
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.scale(s, s).step()
    this.data.questionInfo.options[index].animate = animation.export()

    this.setData({
      questionInfo: this.data.questionInfo
    })
  },
  start(e) {
    this.action(e, 0.8)
  },
  end(e) {
    this.action(e, 1.0)
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
    animation.width("90%").step()
    this.setData({
        animationDataProcess: animation.export(),
    })

    this.timer = setTimeout(()=>{
       if(!this.data.isOver){
          this.fail()
       }
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
    animation.width(0).step() 
    this.setData({
        animationDataProcess: animation.export(),
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (shareRes) {
      let title = app.index.appInfo.data.data.share_title[0]
      let icon = app.index.appInfo.data.data.ico[0]
      let thiz = this
      if (shareRes.from == "button"){
          title = app.index.appInfo.data.data.share_title[1]
          icon = app.index.appInfo.data.data.ico[1]
      }
      if (thiz.issucc){
          title = app.index.appInfo.data.data.share_title[2]
          icon = app.index.appInfo.data.data.ico[2]
      }
      return app.index.commonShare(shareRes, title, icon, (iv, ed)=>{   
          app.index.shareSucc(iv, ed, (u)=>{
              if (thiz.isfail) {
                thiz.help()
              }
              thiz.toogleFail(0)
          })
      }, this.fail ? 1 : -1) 
  }
})
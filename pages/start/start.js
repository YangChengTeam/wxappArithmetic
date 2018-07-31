// pages/start/start.js
//获取应用实例

const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkgen = require('../../libs/yc/yc-arithmetic-gen.js')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")
const kkpromise = require("../../libs/yc/yc-promise.js")
const offset = 4

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
    isShowContent: false,
    musicStatus: "on",

    questionInfo: {},
    currentIndex: 0,
    rightNumber: 0,

    isOver: false,
    avatarImg: '',

    isHelp: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (app.index.appInfo && app.index.appInfo.data && app.index.appInfo.data.data && app.index.appInfo.data.data.question_num) {
      this.setData({
        count: app.index.appInfo.data.data.question_num
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.noPlayableNum()) {
      return
    }

    if (app.index.appInfo.data && app.index.appInfo.data.data.status != 1) {
      this.setData({
        isHelp: true
      })
    } else {
      let helpRnd = [false, true, true, false, true, false, true, false, true, false, true, false, true, false, true, true, false, false, true, true, true, false, true, false, true, true, true, false, true, false, true, false, false, true, true, false, true, false, true, false, true, false, false, false, true, false, true, false, true, false, , true, false, true, false, true, false, , true, false, true, false, true, false, , true, false, true, false, true, true, , true, false, true, false, true, false,]
      let h = helpRnd[parseInt(Math.random() * (helpRnd.length))]
      this.setData({
        isHelp: h
      })
    }

    let thiz = this

    co(function* () {
      let res = yield kkservice.getQuestionMoney(app.formId)
      let t = 6
      if (res.data && res.data.code == 1) {
        let questionInfo = res.data.data
        questionInfo.t = parseInt(questionInfo.time) || t
        if (questionInfo.t < 10) {
          questionInfo.t = "0" + questionInfo.t;
        }
        thiz.setData({
          questionInfo: questionInfo,
          isShowContent: true
        })
        thiz.countdownAnimate()
        thiz.question_ids = thiz.data.questionInfo.id + ","
      } else {
        thiz.netError = 1
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },
  noPlayableNum() {
    if (app.index.data.userInfo && app.index.data.userInfo.playable_num <= 0) {
      this.openShare()
      return true
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.musicStatus != "on"){
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
  moneyMusicPlay() {
    this.playMusic('/assets/audio/money.mp3')
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
      this.countDown(thiz.data.questionInfo)
    }, 5500)
  },
  invisiable(){
    this.data.musicStatus = "off"
    this.stopMusic();
    if (this.loopInnerAudioContext) {
      this.loopInnerAudioContext.stop()
    }
  },
  setUserInfo(data) {
    if (data && data.money) {
      app.index.data.userInfo.playable_num = data.playable_num
      app.index.data.userInfo.total_num += 1
      app.index.data.userInfo.played_num = data.played_num
      app.index.data.userInfo.money = data.money
    } else {
      if (app.index.data.userInfo.playable_num > 0) {
        app.index.data.userInfo.playable_num -= 1
      }
      app.index.data.userInfo.total_num += 1
      app.index.data.userInfo.played_num += 1
    }
    app.index.setData({
      userInfo: app.index.data.userInfo
    })
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
    app.index.isStart = false
    if (!this.data.isOver && this.netError != 1 && !this.sharing) {
      this.emptyQuestion(() => {
        this.setUserInfo()
      })
    }
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

  fail() {
    let thiz = this
    if (this.data.count - this.data.currentIndex <= offset) {
      this.setData({
        isHelp: true
      })
    }
    this.isfail = true
    this.data.isOver = true
    this.setData({
      isOver: true
    })
    this.resetCountDown()
    this.errorMusicPlay()
    this.toogleFail(1)
    if (this.data.isHelp) {
      this.failMusicPlay()
    }
    this.setUserInfo(this.answerData)

  },
  answer(e) {
    if (this.isAnswer) return
    this.isAnswer = true
    if (this.data.isOver) return
    let thiz = this
    let index = (e.currentTarget.dataset.option)
    let option = {}
    co(function* () {
      wx.showLoading({
        title: '请稍后...',
        mask: true
      })
      var res = yield kkservice.getAnswerMoney(index, thiz.data.questionInfo.id, thiz.data.questionInfo.question_token)
      wx.hideLoading()
      thiz.isAnswer = false
      if (res.data && res.data.code == 1) {
        option.is_answer = res.data.data.is_answer
        thiz.data.isFinal = res.data.data.is_final
        thiz.answerData = res.data.data
        if (thiz.data.isFinal) {
          app.id = res.data.data.money_id
          app.money = res.data.data.get_money
        }
      }
      if (option.is_answer === 1) {
        thiz.succ()
      } else {
        thiz.fail()
      }
    })
  },
  succ() {
    let thiz = this
    this.rightMusicPlay()
    this.resetCountDown()
    if (this.data.isFinal || this.data.currentIndex + 1 >= this.data.count) {
      this.issucc = true
      this.data.isOver = true
      this.setData({
        isOver: true
      })
      this.setUserInfo(this.answerData)

      thiz.setData({
        rightNumber: ++thiz.data.rightNumber,
        avatarImg: app.index.data.userInfo.face
      })
      thiz.toogleSucc(1)
      return
    }
    thiz.data.questionInfo.animate = ''
    thiz.setData({
      questionInfo: thiz.data.questionInfo
    }, ()=>{
      thiz.countDown(thiz.data.questionInfo)
    })
    app.start = thiz
    co(thiz.getQuestion)
  },

  * getQuestion(isHelppp) {
    let thiz = app.start
    let question_ids = ""
    question_ids = thiz.question_ids
  

    wx.showLoading({
      title: '下一题...',
      mask: 'true'
    })

    let res 
    if (thiz.isHelp){
       thiz.isHelp = false
        res = yield kkservice.getQuestionMoney(app.formId, isHelp, thiz.data.questionInfo.question_token, thiz.data.currentIndex + 1)
    } else {
        res = yield kkservice.getQuestionMoney(app.formId)
    }
    
    let t = 6
    wx.hideLoading()
    if (res.data && res.data.code == 1) {
      let questionInfo = res.data.data
      questionInfo.t = parseInt(questionInfo.time) || t
      if (questionInfo.t < 10) {
        questionInfo.t = "0" + questionInfo.t;
      }
      thiz.question_ids += questionInfo.id + ","
      thiz.data.questionInfo = questionInfo
      setTimeout(() => {
        ++thiz.data.currentIndex
        questionInfo.animate = ' fadeIn'
        thiz.setData({
          questionInfo: questionInfo,
          currentIndex: thiz.data.currentIndex
        })
      }, 10)
    } else {
      thiz.getQuestion()
    }
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
    this.toogleSucc(0)
    wx.navigateBack({})
  },
  navagateToPrizee(){
    if (this.opening) return
    this.opening = true
    let thiz = this

    co(function* () {
      wx.showLoading({
        title: '领取中...',
        mask: true
      })

      let res = yield kkservice.getRedBag(app.id, app.formId)
      wx.hideLoading()
      if (res && res.data) {
        if (res.data.code == 1) {
          thiz.moneyMusicPlay()
          app.index.data.userInfo.money = res.data.data.f_money
          app.index.setData({
            userInfo: app.index.data.userInfo
          })
          setTimeout(function () {
            thiz.toogleSucc(0)
            wx.redirectTo({
              url: '/pages/openmoney/openmoney',
            })
          }, 800)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
      thiz.opening = false
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
      if(this.data.isOver) return
       this.emptyQuestion()
       this.fail()
    }, t)
  },
  emptyQuestion(callback) {
    let thiz = this
    co(function* () {
      let res = yield kkservice.emptyQuestion()
      if (res && res.data && res.data.code == 1) {
        if (callback) callback()
      }
    })
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
  openShare() {
    this.sharing = true
    this.toogleShare(1.0)
  },
  closeShare() {
    wx.navigateBack({

    })
  },
  toogleShare(opacity) {
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
      animationDataShare: animation.export(),
      animationDataMaskShare: animationMask.export()
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (shareRes) {
    let title = app.index.appInfo.data.data.share_title[0]
    let icon = app.index.appInfo.data.data.ico[0]
    let thiz = this
    let lp = -1
    if (!this.sharing) {
      if (shareRes.from == "button") {
        title = app.index.appInfo.data.data.share_title[1]
        icon = app.index.appInfo.data.data.ico[1]
      }

      if (thiz.issucc) {
        title = app.index.appInfo.data.data.share_title[2]
        icon = app.index.appInfo.data.data.ico[2]
      }

      if (thiz.isfail) {
        lp = 1
      }

    } else {
      lp = 0
    }
    return app.index.commonShare(shareRes, title, icon, (iv, ed) => {
      app.index.shareSucc(iv, ed, (u) => {
        if (!thiz.sharing) {
          if (thiz.isfail) {
            thiz.help()
          }
          thiz.toogleFail(0)
        } else {
          if (u.playable_num > 0) {
            wx.redirectTo({
              url: '/pages/start/start',
            })
          }
        }
      }, lp)
    }, lp)
  },
  help() {
    this.data.isOver = false
    this.setData({
      isHelp: true,
      isOver: false
    })
    this.lp = 1
    this.isHelp = true
    this.succ()
  }
})
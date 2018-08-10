// pages/start/start.js
//获取应用实例

const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkgen = require('../../libs/yc/yc-arithmetic-gen.js')
const kkservice = require("../../libs/yc/yc-service.js")
const offset = 4
const preTime = 3
var questions = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 10,
    animationData3: {},
    animationData2: {},
    animationData1: {},
    animationDataStart: {},
    gameAnimationDataGameStart: {},
    timeAnimationDataGameStart: {},
    animationDataStartDesp: {},
    animationDataSelect: {},
    animationDataRight: {},
    animationDataError: {},
    animationDataSucc: {},
    animationDataFail: {},
    animationDataMaskSucc: {},
    animationDataMaskFail: {},
    animationDataProcess: {},
    animationDataM2Roate: {},
    animationDataM3Roate: {},
    animationDataMiuscRoate: {},

    animationDataMaskShare: {},
    animationDataShare: {},
    musicStatus: "on",

    questionInfo: {},
    currentIndex: 0,
    rightNumber: 0,
    

    startImg: '../../assets/images/mstart.png',
    isOver: false,
    isFinal: false,
    isHelp: true,
    avatarImg: '',

    isShowStar: false,
    nums: [],
    results: [],
    numkeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, "删除", 0, "清除"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (app.index.data.appInfo && app.index.data.appInfo.question_num) {
      this.setData({
        count: app.index.data.appInfo.question_num
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

    if (app.index.data.appInfo.status != 1) {
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
        
        questionInfo.preTime = preTime
        questionInfo.aIndex = 0
        let nums = questionInfo.question.split("")
        thiz.data.results = []
        nums.forEach(v => {
          thiz.data.nums.push({
            "num": v,
            "img": "../../assets/images/star.png"
          })
          thiz.data.results.push("")
        })    
        thiz.setData({
          questionInfo: questionInfo,
          isShowContent: true,
          nums: thiz.data.nums,
          results: thiz.data.results
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.musicStatus == "off") {
      this.data.musicStatus = "on"
      this.backgroundMusicPlay()
    }
  },
  noPlayableNum() {
    if (app.index.data.userInfo.playable_num <= 0) {
      this.openShare()
      return true
    }
  },
  playMuisc() {
    if (this.innerAudioContext) {
      this.innerAudioContext.play()
    }
  },
  pauseMusic() {
    if (this.innerAudioContext) {
      this.innerAudioContext.pause()
    }
  },
  stopMusic() {
    if (this.innerAudioContext) {
      this.innerAudioContext.stop()
    }
    if (this.titleAudioContext) {
      this.titleAudioContext.stop()
    }
  },
  playMusic(src, loop = false, last = false) {
    this.stopMusic()
    if (this.data.musicStatus != "on") {
      return
    }
    const innerAudioContext = wx.createInnerAudioContext()
    if (loop) {
      this.loopInnerAudioContext = innerAudioContext
    } else {
      this.innerAudioContext = innerAudioContext
    }

    if(last){
      this.lastAudioContext = innerAudioContext
    }  
    innerAudioContext.src = src
    innerAudioContext.loop = loop
    innerAudioContext.play()
  },
  playTitle() {
    this.playMusic(this.data.questionInfo.mp3, false, true)
  },
  coutedownMusicPlay() {
    this.playMusic('/assets/audio/coutedown.wav')
  },
  readygoMusicPlay() {
    this.playMusic('/assets/audio/readygo.wav')
  },
  backgroundMusicPlay() {
    // this.playMusic('/assets/audio/background.wav', true)
  },
  rightMusicPlay() {
    this.playMusic('/assets/audio/right.wav')
  },
  errorMusicPlay() {
    this.playMusic('/assets/audio/error.wav')
  },
  nextMusicPlay() {
    this.playMusic('/assets/audio/next.mp3')
  },
  delMusicPlay() {
    this.playMusic('/assets/audio/del.mp3')
  },
  clearMusicPlay() {
    this.playMusic('/assets/audio/clear.mp3')
  },
  last3MusicPlay() {
    this.playMusic('/assets/audio/last.mp3', false, true)
  },
  failMusicPlay() {
    setTimeout(() => {
      this.playMusic('/assets/audio/fail.wav')
    }, 500)
  },
  moneyMusicPlay() {
    this.playMusic('/assets/audio/money.mp3')
  },
  countdownAnimate() {
    var thiz = this
    // var animation3 = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // this.animation3 = animation3
    // animation3.opacity(1).scale(0.5).step()
    // animation3.opacity(0).step()

    // var animation2 = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // this.animation2 = animation2
    // animation2.opacity(1).scale(0.5).step()
    // animation2.opacity(0).step()

    // var animation1 = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // this.animation1 = animation1
    // animation1.opacity(1).scale(0.5).step()
    // animation1.opacity(0).step()

    // var animationDataStart = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // this.animationDataStart = animationDataStart
    // animationDataStart.opacity(1).scale(0.4).step()
    // animationDataStart.opacity(0).step()

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
    timeAnimationDataGameStart.top("100%").opacity(0).step()


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

    // setTimeout(() => {
    //   this.coutedownMusicPlay()
    //   thiz.setData({
    //     animationData3: thiz.animation3.export()
    //   })
    // }, 500)

    // setTimeout(() => {
    //   thiz.setData({
    //     animationData2: thiz.animation2.export()
    //   })
    // }, 1500)

    // setTimeout(() => {
    //   thiz.setData({
    //     animationData1: thiz.animation1.export()
    //   })
    // }, 2500)

    // setTimeout(() => {
    //   thiz.setData({
    //     animationDataStart: thiz.animationDataStart.export()
    //   })
    //   this.readygoMusicPlay()
    // }, 3500)

    thiz.setData({
      gameAnimationDataGameStart: thiz.gameAnimationDataGameStart.export(),
      timeAnimationDataGameStart: thiz.timeAnimationDataGameStart.export(),
      animationDataSelect: thiz.animationDataSelect.export(),
      animationDataStartDesp: thiz.animationDataStartDesp.export(),
    })
    this.preCountDown()
    this.backgroundMusicPlay()
  },
  
  invisiable() {
    this.data.musicStatus = "off"
    this.stopMusic()
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
  },
  start(e) {
    this.action(e, 0.8)
  },
  end(e) {
    this.action(e, 1.0)
  },
  preAnswer(e) {
    if (!this.data.isShowStar){
       return
    }
    let index = e.currentTarget.dataset.index
    if(index == 9){
       this.delMusicPlay()
       if(this.data.questionInfo.aIndex == 0){
          return
       }
       
       --this.data.questionInfo.aIndex
       this.data.results[this.data.questionInfo.aIndex] = ""
       this.data.nums[this.data.questionInfo.aIndex].img = '../../assets/images/star.png'
       this.setData({
         results: this.data.results,
         nums: this.data.nums
       })
    } else if(index == 11){
      this.clearMusicPlay()
      this.data.questionInfo.aIndex = 0
      for(let i = 0; i < this.data.results.length; i++){
          this.data.results[i] = ""
          this.data.nums[i].img = '../../assets/images/star.png'
      }
      this.setData({
        results: this.data.results,
        nums: this.data.nums
      })
    } else {
      if (this.data.questionInfo.aIndex >= this.data.nums.length) {
           this.delMusicPlay()
           return
      }
      console.log(index)
      if(index > 9){
         index = 0
      } else {
         index = index + 1
      }
      this.data.results[this.data.questionInfo.aIndex] = index
      if (index == this.data.nums[this.data.questionInfo.aIndex].num){
        this.rightMusicPlay()
        this.data.nums[this.data.questionInfo.aIndex].img = '../../assets/images/right-star.png'
      } else {
        this.errorMusicPlay()
        this.data.nums[this.data.questionInfo.aIndex].img = '../../assets/images/error-star.png'
      }
      this.setData({
        results: this.data.results,
        nums: this.data.nums
      })
      if (this.data.questionInfo.aIndex >= this.data.nums.length) {
        this.data.questionInfo.aIndex = this.data.nums.length -1
      } else {
        this.data.questionInfo.aIndex++
      }
      if (this.data.results.join("") == this.data.questionInfo.question) {
        this.answer()
      }
    }
  },
  answer() {
    if (this.isAnswer) return
    this.isAnswer = true
    if (this.data.isOver) return
    let thiz = this
    let option = {}
    co(function* () {
      wx.showLoading({
        title: '请稍后...',
        mask: true
      })
      var res = yield kkservice.getAnswerMoney(thiz.data.results.join(""), thiz.data.questionInfo.id,
      thiz.data.questionInfo.question_token)
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
        console.log(thiz.data.questionInfo)
        thiz.setData({
          questionInfo: thiz.data.questionInfo,
        }, () => {
          setTimeout(() => {
            thiz.succ()
          }, 10)
        })

      } else {   
        console.log(thiz.data.questionInfo.options)
        thiz.setData({
          questionInfo: thiz.data.questionInfo,
        }, () => {
          setTimeout(() => {
            thiz.fail()
          }, 10)
        })
      }
    })
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
  succ() {
    let thiz = this
    this.nextMusicPlay()
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
      thiz.is_double = 1
      thiz.money_token = thiz.answerData.money_token
      thiz.toogleSucc(1)
      return
    }
    thiz.data.questionInfo.animate = ''
    thiz.setData({
      questionInfo: thiz.data.questionInfo
    })
    app.start = thiz
    co(thiz.getQuestion)
  },

  * getQuestion() {
    let thiz = app.start
    wx.showLoading({
      title: '下一题...',
      mask: 'true'
    })
    let res 
    if(thiz.isHelp){
      thiz.isHelp = false
      res = yield kkservice.getQuestionMoney(app.formId, 1, thiz.data.questionInfo.question_token, thiz.question_ids)
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
      questionInfo.aIndex = 0
      thiz.question_ids += questionInfo.id + ","
      questionInfo.preTime = preTime
      let nums = questionInfo.question.split("")
      thiz.data.nums = []
      thiz.data.results = []
      nums.forEach(v => {
        thiz.data.nums.push({
           "num": v,
          "img": "../../assets/images/star.png"
        })
        thiz.data.results.push("")
      })    
      thiz.data.questionInfo = questionInfo
      setTimeout(() => {
        ++thiz.data.currentIndex
        questionInfo.animate = ' fadeIn'  
        thiz.setData({
          questionInfo: questionInfo,
          nums: thiz.data.nums,
          results: thiz.data.results,
          currentIndex: thiz.data.currentIndex,
          isShowStar: false
        })   
        thiz.preCountDown()
      }, 10)
    } else {
      thiz.getQuestion()
    }
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
  continuePlay(e) {
    if (this.noPlayableNum()) {
      this.toogleFail(0)
      return
    }
    wx.redirectTo({
      url: 'start',
    })
  },
  closeFail(e) {
    this.toogleFail(0)
    wx.navigateBack({

    })
  },
  closeSucc(e) {
    this.toogleFail(0)
    wx.navigateBack({})
  },
  navagateToPrizee() {
    if (this.opening) return
    this.opening = true
    let thiz = this

    co(function* () {
      wx.showLoading({
        title: '领取中...',
        mask: true
      })

      let res = yield kkservice.getRedBag(app.id)
      wx.hideLoading()
      if (res && res.data) {
        if (res.data.code == 1) {
          thiz.moneyMusicPlay()
          app.money = res.data.data.change_money
          app.index.data.userInfo.money = (res.data.data.f_money).toFixed(2)
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
          })
        }
      }
      thiz.opening = false
    })
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
  preCountDown() {
    this.pretimer = setInterval(() => {
      if (this.data.questionInfo.preTime <= 0) {
            this.setData({
               isShowStar: true
            })
            this.countDown()
            clearInterval(this.pretimer)
            return
      }
      // if (this.data.questionInfo.preTime > 2){
      //   this.last3MusicPlay()
      // }
      if (this.data.questionInfo.preTime == 2){
        this.readygoMusicPlay()
      }
      this.data.questionInfo.preTime -= 1
      this.setData({
        questionInfo: this.data.questionInfo
      })
    }, 1000)
  },
  countDown() {
    this.timer = setInterval(() => {
      if (this.data.isOver) return   
      if (this.data.questionInfo.t <= 0) {
        this.data.isOver = true
        this.emptyQuestion()
        this.fail()
        clearInterval(this.timer)
        return
      }
      if (this.data.questionInfo.t <= 6) {
        this.data.questionInfo.lastStyle = "last"
        this.last3MusicPlay()
      }
      this.data.questionInfo.t -= 1
      if (this.data.questionInfo.t < 10) {
        this.data.questionInfo.t = "0" + this.data.questionInfo.t;
      }
      this.setData({
        questionInfo: this.data.questionInfo
      })
    }, 1000)
  },
  resetCountDown() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  openShare() {
    this.sharing = true
    this.toogleShare(1)
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
    let appInfo = app.index.data.appInfo
    let title = appInfo.share_title[0]
    let icon = appInfo.share_ico[0]
    let thiz = this
    let lp = -1

    if (!this.sharing) {
      if (shareRes.from == "button") {
        title = appInfo.share_title[1]
        icon = appInfo.share_ico[1]
      }
      if (thiz.issucc) {
        title = appInfo.share_title[2]
        icon = appInfo.share_ico[2]
      }
      if (this.fail) {
        lp = 1
      }
    } else {
      lp = 0
    }
    if (thiz.is_double){
      title = appInfo.share_title[3]
      icon = appInfo.share_ico[3]
    }
    return app.index.commonShare(shareRes, title, icon, (iv, ed) => {
      app.index.shareSucc(iv, ed, (u) => {
        if (!thiz.sharing) {
          if (thiz.isfail) {
            thiz.help()
          }
          if (thiz.money_token){
            thiz.navagateToPrizee()
          }
          thiz.toogleFail(0)
        } else {
          if (u.playable_num > 0) {
            wx.redirectTo({
              url: '/pages/start/start',
            })
          }
        }
      }, lp, thiz.is_double, thiz.money_token)
    }, lp, thiz.is_double, thiz.money_token)
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
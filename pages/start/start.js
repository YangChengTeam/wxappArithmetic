// pages/start/start.js
//获取应用实例

const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkgen = require('../../libs/yc/yc-arithmetic-gen.js')
const kkservice = require("../../libs/yc/yc-service.js")
const offset = 4

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
    miuscImg: '',
    isOver: false,
    wordplay: 0,
    miuscplay: 0,
    isFinal: false,
    isHelp: false,
    avatarImg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  onReady: function() {
    if (this.noPlayableNum()) {
      return
    }

    if (app.index.appInfo.data.data.status != 1) {
      this.setData({
        isHelp: true
      })
    } else {
      let helpRnd = [false, true, true, false, true, false, true, false, true, false, true, false, true, false, true, true, false, false, true, true, true, false, true, false, true, true, true, false, true, false, true, false, false, true, true, false, true, false, true, false, true, false, false, false, true, false, true, false, true, false, , true, false, true, false, true, false, , true, false, true, false, true, false, , true, false, true, false, true, true, , true, false, true, false, true, false, ]
      let h = helpRnd[parseInt(Math.random() * (helpRnd.length))]
      this.setData({
        isHelp: h
      })
    }

    let thiz = this

    co(function*() {
      let res = yield kkservice.getQuestionMoney(app.formId)
      let t = 6
      if (res.data && res.data.code == 1) {
        let questionInfo = res.data.data
        questionInfo.t = parseInt(questionInfo.time) || t
        if (questionInfo.t < 10) {
          questionInfo.t = "0" + questionInfo.t;
        }
        questionInfo.options.forEach(function(v) {
          v.op2 = v.op.toUpperCase()
        })
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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
  playMusic(src, loop = false, titleMp3 = false) {
    this.stopMusic()
    if (this.data.musicStatus != "on") {
      return
    }
    const innerAudioContext = wx.createInnerAudioContext()
    if (!titleMp3) {
      if (loop) {
        this.loopInnerAudioContext = innerAudioContext
      } else {
        this.innerAudioContext = innerAudioContext
      }
    } else {
      let thiz = this
      this.titleAudioContext = innerAudioContext
      this.titleAudioContext.onEnded(function() {
        if (!thiz.timer) {
          thiz.countDown(thiz.data.questionInfo)
        }
        if (thiz.data.wordplay) {
          thiz.startGame()
        }
      })
    }
    innerAudioContext.src = src
    innerAudioContext.loop = loop
    innerAudioContext.play()
  },
  playTitle() {
    this.playMusic(this.data.questionInfo.mp3, false, true)
  },
  coutedownMusicPlay() {
    this.playMusic('/assets/audio/coutedown.mp3')
  },
  readygoMusicPlay() {
    this.playMusic('/assets/audio/readygo.wav')
  },
  backgroundMusicPlay() {
    //this.playMusic('https://wx1.bshu.com/static/mp3/background.mp3', true)
  },
  rightMusicPlay() {
    this.playMusic('/assets/audio/right.mp3')
  },
  errorMusicPlay() {
    this.playMusic('/assets/audio/error.mp3')
  },
  failMusicPlay() {
    setTimeout(() => {
      this.playMusic('/assets/audio/fail.mp3')
    }, 500)
  },
  succMusicPlay() {
    setTimeout(() => {
      this.playMusic('/assets/audio/succ.mp3')
    }, 500)
  },
  moneyMusicPlay() {
    this.playMusic('/assets/audio/money.mp3')
  },
  countdownAnimate() {
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
    animation1.opacity(1).scale(0.5).step()
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

    setTimeout(() => {
      this.startGame()
    }, 5500)
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
  onHide: function() {
    this.invisiable()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.invisiable()
    app.index.isStart = false
    if (!this.data.isOver && this.netError != 1) {
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
  startMiusc(e) {
    // let r = 0
    // this.startGame()
    // if (this.data.miuscplay == 1) {
    //   if (this.loopInnerAudioContext) {
    //     this.loopInnerAudioContext.pause()
    //   }
    //   this.setData({
    //     animationDataMiuscRoate: {},
    //     miuscImg: '../../assets/images/moff.png',
    //   })
    //   if (this.miusctimer) {
    //     clearInterval(this.miusctimer)
    //   }
    //   this.data.miuscplay = 0
    //   return
    // } else {
    //   this.backgroundMusicPlay()
    //   var animation = wx.createAnimation({
    //     duration: 2000,
    //     timingFunction: 'ease',
    //   })
    //   this.miuscAnimation = animation
    //   animation.rotate(180).step()
    //   this.data.miuscplay = 1
    //   this.setData({
    //     animationDataMiuscRoate: animation.export(),
    //     miuscImg: '../../assets/images/mon.png',
    //   })
    // }

    // this.miusctimer = setInterval(function() {
    //   r += 1
    //   animation.rotate((r + 1) * 180).step()
    //   this.setData({
    //     animationDataMiuscRoate: animation.export()
    //   })
    // }.bind(this), 2000)
  },
  startGame(e) {
    console.log('startGame')
    if (this.isstartGame) return
    this.isstartGame = true
    var animationM2 = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })
    this.animationM2 = animationM2

    if (this.data.wordplay == 1) {
      this.stopMusic()
      animationM2.rotate(0).step()
      this.setData({
        animationDataM3Roate: animationM2.export(),
        animationDataM2Roate: "",
        startImg: '../../assets/images/mstart.png',
      })
      this.data.wordplay = 0
      this.isstartGame = false
      return
    } else {
      this.data.wordplay = 1
      let thiz = this
      animationM2.rotate(30).step()
      thiz.setData({
        animationDataM3Roate: animationM2.export(),
        animationDataM2Roate: "ig",
        startImg: '../../assets/images/mstop.png',
      })
      thiz.isstartGame = false
      co(function*() {
        if (!thiz.data.questionInfo.mp3) {
          let res = yield kkservice.text2Mp3(thiz.data.questionInfo.name)
          thiz.data.questionInfo.mp3 = res.filename
        }
        thiz.playTitle()
      })
    }
  },
  start(e) {
    this.action(e, 0.8)
  },
  end(e) {
    this.action(e, 1.0)
  },
  answer(e) {
    if (this.isAnswer) return
    this.isAnswer = true
    this.data.wordplay = 1
    this.startGame()
    if (this.data.isOver) return
    this.data.questionInfo.mp3 = ""
    let thiz = this
    let index = (e.currentTarget.dataset.index)
    let option = this.data.questionInfo.options[index]
    co(function*() {
      wx.showLoading({
        title: '请稍后...',
        mask: true
      })
      var res = yield kkservice.getAnswerMoney(option.op, thiz.data.questionInfo.id)

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
        thiz.data.questionInfo.options.forEach(function(v, k) {
          if (k == index) {
            v.style = ' right'
          }
        })
        console.log(thiz.data.questionInfo)
        thiz.setData({
          questionInfo: thiz.data.questionInfo,
        }, () => {
          setTimeout(() => {
            thiz.succ()
          }, 10)
        })

      } else {
        thiz.data.questionInfo.options.forEach(function(v, k) {
          if (k == index) {
            v.style = ' error'
          }
        })
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
    })
    app.start = thiz
    co(thiz.getQuestion)
  },

  * getQuestion() {
    let thiz = app.start
    let isHelp = (!thiz.isHelpd && thiz.data.isHelp) ? 1 : 0
    let question_ids = ""
    if (isHelp == 1) {
      question_ids = thiz.question_ids
    }

    wx.showLoading({
      title: '下一题...',
      mask: 'true'
    })
    let res = yield kkservice.getQuestionMoney("", app.formIdisHelp, thiz.data.questionInfo.question_token, question_ids)

    if (isHelp == 1) {
      thiz.isHelpd = true
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
      questionInfo.options.forEach(function(v) {
        v.op2 = v.op.toUpperCase()
      })
      thiz.data.questionInfo = questionInfo
      thiz.startGame()
      setTimeout(() => {
        ++thiz.data.currentIndex
        questionInfo.animate = ' fadeIn'
        thiz.setData({
          questionInfo: questionInfo,
          currentIndex: thiz.data.currentIndex
        })
      }, 10)
    } else {
      this.getQuestion()
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

    co(function*() {
      wx.showLoading({
        title: '领取中...',
        mask: true
      })

      let res = yield kkservice.getRedBag(app.id)
      wx.hideLoading()
      if (res && res.data) {
        if (res.data.code == 1) {
          thiz.moneyMusicPlay()
          app.index.data.userInfo.money = res.data.data.f_money
          app.index.setData({
            userInfo: app.index.data.userInfo
          })
          setTimeout(function() {
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
    co(function*() {
      let res = yield kkservice.emptyQuestion()
      if (res && res.data && res.data.code == 1) {
        if (callback) callback()
      }
    })
  },
  countDown(questionInfo) {
    this.timer = setInterval(() => {
      if (this.data.isOver) return
      if (this.data.questionInfo.t <= 0) {
        this.data.isOver = true
        this.emptyQuestion()
        this.fail()
        return
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
  onShareAppMessage: function(shareRes) {
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
      if (this.fail) {
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
            thiz.closeShare(0)
            wx.navigateTo({
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
    this.succ()
  }
})
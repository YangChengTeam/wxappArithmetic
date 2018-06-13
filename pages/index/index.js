//index.js
//获取应用实例
const app = getApp()
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")
const kkpromise = require("../../libs/yc/yc-promise.js")

Page({
  data: {
    gameStart_animationData: {},
    rank_animationData: {},
    prize_animationData: {},
    invateFriend_animationData: {},
    more_animationData: {},
    rule_animationData: {},
    animationDataSign: {},
    animationDataMaskSign: {},
    userInfo: {
      money: 0,
      playable_num: 0,
      total_num: 0 
    },
    isLogin: false,
    signImg: '../../assets/images/sign-1.png',
    contactImg: '../../assets/images/contact-1.png',
    signInfo: {},
    loaded: false,
    isShowContent: false,
  },
  onLoad: function () {   
     let thiz = this
     app.index = this
     this.shareTitle = '我正在参加「世界杯有奖答题」，这里竟然可以免费领娃娃！？'
     co(function*(){
       var [status, appInfo] = yield [kkservice.authPermission("scope.userInfo"), yield kkservice.getAppInfo()] 
          if (status == kkconfig.status.authStatus.authOK){
              thiz.login(undefined, undefined, appInfo.data.data.play_total_num) 
          } else{
            setTimeout(()=>{
              thiz.setData({
                isShowContent: true
              });
            }, 1000)
          } 
          thiz.appInfo = appInfo
          wx.showShareMenu({
            withShareTicket: true
          })
     })   
  },
  onHide(){
     if(this.atimer){
       clearInterval(this.atimer)
     }
  }
  ,
  onShow(){
    this.gif()
  }
  ,
  gif(){
    let a=1, b=1
    var thiz = this
    if (this.atimer) {
      clearInterval(this.atimer)
    }
    this.atimer = setInterval(function(){
        if(a > 3){
           a = 1
        }
        if( b > 2){
           b = 1
        }
        thiz.setData({
          signImg: `../../assets/images/sign-${++a}.png`,
        })
        thiz.setData({
          contactImg: `../../assets/images/contact-${++b}.png`,
        })
    }, 300)
  },
  login(url, callback, total_num){
    if(this.data.isLogin){  
      if (url) {
        wx.navigateTo({
          url: url,
        })
      }
      return
    }
    let thiz = this
    co(function* () {
      if (thiz.data.isShowContent){
         wx.showLoading({
           title: '登录中...',
         })
      }
      if (yield kkservice.login()) {
        let [userInfo, signInfo] = yield [kkservice.getUserInfo(), kkservice.getuserSignInfo()]
        if (thiz.data.isShowContent) {
            wx.hideLoading()
        }
        thiz.signInfo = signInfo.data.data
        if(kkcommon.isStorageInToday('sign')){
            thiz.signInfo.signed = true
        }
        if(total_num){
            userInfo.data.data.total_num = total_num
        }
        thiz.setData({
          isLogin: true,
          userInfo: userInfo.data.data,
          signInfo: thiz.signInfo
        })
        if(url){
          wx.navigateTo({
            url: url,
          })
        }
        if(callback){
           callback()
        }
      }
      thiz.setData({
         isShowContent: true
      })
    })
  },
  doLogin(res){
     let thiz = this
     if(res.detail && res.detail.userInfo){
        thiz.login('/pages/user_center/user_center')
     }
  },
  loginToStart(res){
    if (this.isStart) return
    this.isStart = true
    let thiz = this
    if (thiz.data.isLogin && thiz.data.userInfo.playable_num <= 0){
      wx.showModal({
          title: '',
          content: '分享到群, 增加挑战机会',
          showCancel: false,
          complete(){
             wx.navigateTo({
               url: '/pages/user_center/user_center',
             })
          }
      })
      return
    }
    console.log('loginToStart')
    if (res.detail && res.detail.userInfo) {
      thiz.login('/pages/start/start')
    }
  },
  loginToMore(res) {
    console.log('loginToMore')
    let thiz = this
    if (res.detail && res.detail.userInfo) {
      thiz.login('/pages/user_center/user_center')
    }
  },
  navigateToRank() {
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  },
  navigateToPrize() {
    wx.navigateTo({
      url: '/pages/prize/prize',
    })
  },
  navigateToRule() {
    wx.navigateTo({
      url: '/pages/rule/rule',
    })
  },
  action(e, s){
    var index = e.currentTarget.dataset.index
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.scale(s, s).step()
    if (index == 0) {
      this.setData({
        gameStart_animationData: this.animation
      })
    } else if (index == 1) {
      this.setData({
        rank_animationData: this.animation
      })
    } else if (index == 2) {
      this.setData({
        prize_animationData: this.animation
      })
    } else if (index == 3) {
      this.setData({
        invateFriend_animationData: this.animation
      })
    } else if (index == 4) {
      this.setData({
        more_animationData: this.animation
      })
    } else if (index == 5) {
      this.setData({
        rule_animationData: this.animation
      })
    }
  },
  start(e){
     this.action(e, 0.8)
  },
  end(e){
     this.action(e, 1.0)
  },
  openSign(){
    this.toogleSign(1.0)
  },
  closeSign(){
    this.toogleSign(0)
  },
  toogleSign(opacity){
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
        animationDataSign: animation.export(),
        animationDataMaskSign: animationMask.export()
      })
  },
  submit(e){
     app.formId = e.detail.formId
  },
  signIn(e, callback){
     if(this.signInfo.signed) return
     let thiz = this
     co(function*(){
        wx.showLoading({
          title: '正在签到...',
          mask:true
        })
        let res =yield kkservice.userSignIn()
        console.log(res)
        wx.hideLoading()
        if(res.data && res.data.code == 1){
           kkcommon.storageToday('sign', ()=>{
              thiz.signInfo.sign_count = res.data.data.sign_count
              thiz.signInfo.signed = true
              if (res.data.data.user_info.name == 'playable_num'){
                  thiz.data.userInfo.playable_num = res.data.data.user_info.value
              } else if (res.data.data.user_info.name == 'money') {
                  thiz.data.userInfo.money = res.data.data.user_info.value
              }
              thiz.setData({
                  signInfo: thiz.signInfo,
                  userInfo: thiz.data.userInfo
              })
              
           })
        } else {
           wx.showToast({
              title: res.data.msg,
              icon: 'none'
           })
           kkcommon.storageToday('sign', () => {
             thiz.signInfo.signed = true
             thiz.setData({
               signInfo: thiz.signInfo
             })
           })
        } 
        if (callback) {
          callback(thiz.signInfo, thiz.data.userInfo)
        }
     })
  },
  shareSucc(iv, ed, callback, lp){
    let thiz = this
    co(function *(){
        let sessionRes = yield kkpromise.checkSession()
        if (sessionRes.code != "0" &&  sessionRes.errMsg != "checkSession:ok"){
           if (! (yield kkservice.login())){
                wx.showToast({
                  title: 'session_key获取失败',
                  icon: 'none'
                })
                return
           }
        }
        let res = yield kkservice.share(iv, ed, kkconfig.global.session_key, lp)
        if(res.data && res.data.code == 1){
            thiz.data.userInfo.playable_num = res.data.data.playable_num
            thiz.setData({
              userInfo: thiz.data.userInfo
            })
        }
        if (callback) {
          callback(thiz.data.userInfo)
        }
        if (lp == 0 && res.data.msg && res.data.msg.trim().length > 0){
          wx.showModal({
            title: '',
            content: res.data.msg,
            showCancel:false
          })
        }
    })
  },
  commonShare(shareRes, title, icon, callback, lp = 0){
    title = title.replace('{0}', app.index.data.userInfo.nick_name)
    return {
      title: title,
      path: "pages/index/index",
      imageUrl: icon,
      success: function (res) {
        if (lp >= 0 && shareRes.from == "button"){
           kkcommon.share(res.shareTickets[0], callback, lp)
        }
      },
      fail(){
        if (lp >= 0 && shareRes.from == "button") {
          wx.showToast({
              title: '取消分享',
              icon: 'none'
          })
        }
      }
    }
  },
  onShareAppMessage(shareRes){
     let thiz = this
     return this.commonShare(shareRes, app.index.appInfo.data.data.share_title[0], app.index.appInfo.data.data.ico[0], (iv, ed)=>{
        thiz.shareSucc(iv, ed)
     }, -1)
  }
})

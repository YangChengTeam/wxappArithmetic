//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    gameStart_animationData: {},
    rank_animationData: {},
    prize_animationData: {},
    invateFriend_animationData: {},
    more_animationData: {},
    rule_animationData: {}
  },
  onLoad: function () {  
    
  },
  login(res){
     if(res.detail && res.detail.userInfo){
       wx.navigateTo({
         url: '/pages/user_center/user_center',
       })
     }
  },
  navigateToStart(){
     wx.navigateTo({
       url: '/pages/start/start',
     })
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
  navigateToMore() {
    wx.navigateTo({
      url: '/pages/user_center/user_center',
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
  }
  ,
  start(e){
     this.action(e, 0.8)
  },
  end(e){
     this.action(e, 1.0)
  }
})

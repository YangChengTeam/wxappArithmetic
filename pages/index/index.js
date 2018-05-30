//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
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
  }
})

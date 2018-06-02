//app.js

App({
  onLaunch: function () {
      wx.authorize({
        scope: 'scope.userInfo',
      })
  }
})
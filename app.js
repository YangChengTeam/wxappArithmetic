//app.js
const regeneratorRuntime = global.regeneratorRuntime = require('/libs/runtime')
const co = require('/libs/co')
const kkservice = require("/libs/yc/yc-service.js")
App({
  onLaunch: function () {
    let thiz = this
    wx.onUserCaptureScreen(function (res) {
         thiz.screenShot()
    })
  },
  screenShot(){
    let thiz = this
    let pages = getCurrentPages()
    let page = pages[pages.length - 1]
    let path = page.route
    let extra = ""
    if (path.indexOf("index") != -1){
        if(thiz.index.sharing){
          extra = "正在分享"
        }
    }
    if (path.indexOf("start") != -1) { 
      if(!thiz.start.isOver){
        extra = "作弊"
      }
      if (thiz.start.sharing) {
        extra = "正在分享"
      }
    }
    kkservice.screenShot(path, extra)
  },
  compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i])
      var num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }

    return 0
  }
})
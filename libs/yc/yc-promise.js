// Author: 张凯
const wrap = function (fn, options) {
  if (options == undefined) options = {}
  var promise = new Promise((resolve, reject) => {
    fn({
      ...options,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
  promise.catch(new Function)
  return promise
}

// wx api promise
const login = function (options) {
  return wrap(wx.login, options)
}

const checkSession = function (options) {
  return wrap(wx.checkSession, options)
}

const request = function (options) {
  return wrap(wx.request, options)
}

const getUserInfo = function (options) {
  return wrap(wx.getUserInfo, options)
}

const getSetting = function (options) {
  return wrap(wx.getSetting, options)
}

const openSetting = function (options) {
  return wrap(wx.openSetting, options)
}

const authorize = function (options) {
  return wrap(wx.authorize, options)
}

const uploadFile = function (options) {
  return wrap(wx.uploadFile, options)
}

const chooseImage = function (options) {
  return wrap(wx.chooseImage, options)
}

const setData = function (thiz, data) {
  var promise = new Promise((resolve, reject) => {
    thiz.setData({
      ...data
    }, resolve)
  })
  promise.catch(new Function)
  return promise
}

const sleep = function (time) {
  var promise = new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
  promise.catch(new Function)
  return promise
}



module.exports = {
  login: login,
  request: request,
  getUserInfo: getUserInfo,
  getSetting: getSetting,
  openSetting: openSetting,
  authorize: authorize,
  setData: setData,
  sleep: sleep,
  checkSession: checkSession,
  chooseImage: chooseImage,
  uploadFile: uploadFile

}
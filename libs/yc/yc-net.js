// Author: 张凯

const kkpromise = require('yc-promise')
const kkcommon = require('yc-common')
const kkconfig = require('yc-config')

function getHeader(data){
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }
    if(kkconfig.global.token && kkconfig.global.token.length > 0){
        header.Authorization = 'Bearer ' + kkconfig.global.token
    }
    if(data){
        header.TK = kkcommon.encrypt(data)
    }
    return header
}

function get(url, data){
    var defaultParams = kkconfig.net.defaultParams
    data = {...data,
            ...defaultParams
            ,t: new Date().getTime()
            }
    return kkpromise.request({
        url: url,
        header: getHeader(data),
        data: data,
        method: 'GET'
    })
}

function uploadFile(url, filePath, data){
  var defaultParams = kkconfig.net.defaultParams
  data = {
    ...data,
    ...defaultParams
    , t: new Date().getTime()
  }
  console.log(data)
  return kkpromise.uploadFile({
    url: url,
    name: 'file',
    header: getHeader(data),
    filePath: filePath,
    formData: data,
    method: 'POST'
  })
}

function post(url, data){
   var defaultParams = kkconfig.net.defaultParams
    data = {
      ...data,
      ...defaultParams
      , t: new Date().getTime()
    }
    return kkpromise.request({
      url: url,
      header: getHeader(data),
      data: data,
      method: 'POST'
    })
}

module.exports = {
   get: get,
   post: post,
   uploadFile: uploadFile
}
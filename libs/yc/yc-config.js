const debug = false
const host = {
  dev: "https://mi.bshu.com",  //测试服务器
  pro: "https://mi.bshu.com"   //正式服务器
}

function getBaseUrl() {
  return (debug ? host.dev : host.pro) + '/api'
}

function getUrl(str) {
  return getBaseUrl() + str
}

// 全局参数配置
var global = {
  token: '',   //服务端返回的token
  userInfo: {}, //用户信息   
}

// 状态配置
const status = {
  authStatus: {
    authOK: 10000,     //授权成功
    authFail: -10000  //授权失败
  }
}

// 网络参数配置
const net = {
  defaultParams: {
    app_type: 'wx',
    app_id: 5
  }
}

module.exports = {
   global: global,
   status: status,
   net: net,

   loginUrl: getUrl("/v1.user/login")
}

// Author: 张凯

const debug = false
const host = {
  dev: "https://wx1.bshu.com/",  //测试服务器
  pro: "https://wx1.bshu.com"   //正式服务器
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
    app_id: 41
  }
}

module.exports = {
  global: global,
  status: status,
  net: net,

  loginUrl: getUrl("/v1.user/login"),
  getUserInfoUrl: getUrl("/v1.game/getUserInfo"),
  topListUrl: getUrl("/v1.game/topList"),
  prizeListUrl: getUrl("/v1.gift/getGiftList"),
  prizeRecordListUrl: getUrl("/v1.gift/myGiftList"),
  appInfoUrl: getUrl("/v1.game/getAppInfo"),
  postScoreUrl: getUrl("/v1.game/postScore"),
  changeGiftUrl: getUrl("/v1.gift/changeGift"),
  complainUrl: getUrl("/v1.game/tousu"),
  getQuestionListUrl: getUrl("/v1.questions/getQuestionList"),
  shareUrl: getUrl("/v1.game/getShareQunInfo"),
  userSignInfoUrl: getUrl("/v1.game/userSignInfo"),
  userSignInUrl: getUrl("/v1.game/userSignIn"),

  getQuestionMoneyUrl: getUrl("/v1.questions/getQuestionMoney"),
  getAnswerMoneyUrl: getUrl("/v1.questions/commonAnswer"),

  getRedBagUrl: getUrl('/v1.money/getRedBag'),
  changeMoneyUrl: getUrl('/v1.money/changeMoney'),
  redBagListUrl: getUrl('/v1.money/redBagList'),
  moneyListUrl: getUrl('/v1.money/moneyList'),
  emptyQuestionUrl: getUrl('/v1.questions/emptyQuestion'),

}


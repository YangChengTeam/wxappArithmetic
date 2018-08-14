// Author: 张凯

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkconfig = require('yc-config')
const kkpromise = require('yc-promise')
const kknet = require('yc-net')

function authPermission(scope) {
  return co.wrap(function* () {
    let res = yield kkpromise.getSetting()
    if (res && res.authSetting[scope]) {
      return kkconfig.status.authStatus.authOK  //已授权
    }
    return kkconfig.status.authStatus.authFail  //未授权
  })()
}

function reLogin() {
  return co.wrap(function* () {
    if (kkconfig.global.token.length > 0) {
      return true
    }
    let status = yield authPermission("scope.userInfo")
    if (status == kkconfig.status.authStatus.authFail) {
      let res = yield kkpromise.openSetting()
      if (!res || !res.authSetting["scope.userInfo"]) {
        return kkconfig.global.status.authFail
      }
    }
    return yield login()
  })()
}

function login() {
  return co.wrap(function* () {
    let res = yield kkpromise.login()
    if (!res || !res.code) {
      return false
    }
    let userInfo = yield kkpromise.getUserInfo()
    if (userInfo) {
      if (typeof userInfo.rawData === 'string') {
        userInfo.rawData = JSON.parse(userInfo.rawData)
      }
      kkconfig.global.userInfo = userInfo.rawData
    }

    let loginData = yield kknet.post(kkconfig.loginUrl, {
      encryptedData: userInfo.encryptedData,
      code: res.code,
      iv: userInfo.iv
    })
    if (loginData.data.code == 1) {
      kkconfig.global.token = loginData.data.data.token.token || ''
      kkconfig.global.session_key = loginData.data.data.session_key
      return true
    }
    return false
  })()
}

function getUserInfo() {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.getUserInfoUrl)
  })()
}

function getTopList(order, p, num) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.topListUrl, {
      order: order,
      p: p,
      num: num
    })
  })()
}

function getPrizeList() {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.prizeListUrl)
  })()
}

function getPrizeRecordList() {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.prizeRecordListUrl)
  })()
}

function getAppInfo() {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.appInfoUrl)
  })()
}

function postScore(score, is_succ, form_id, lp = 0) {
  if (!lp) {
    lp = 0
  }
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.postScoreUrl, {
      score: score,
      is_succ: is_succ,
      form_id: form_id,
      is_help: lp
    })
  })()
}

function changeGift(chageInfo) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.changeGiftUrl, {
      gift_id: chageInfo.id,
      name: chageInfo.name,
      phone: chageInfo.contact,
      addr: chageInfo.address,
    })
  })()
}

function complain(title) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.complainUrl, {
      title: title
    })
  })()
}

function share(iv, ed, sk, lp = 0, is_double = 0, money_token) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.shareUrl, {
      iv: iv,
      encryptedData: ed,
      session_key: sk,
      is_help: lp,
      is_double: is_double,
      money_token: money_token
    })
  })()
}

function getQuestionList(num) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.getQuestionListUrl, {
      num: num
    })
  })()
}

function getuserSignInfo() {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.userSignInfoUrl)
  })()
}

function userSignIn() {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.userSignInUrl)
  })()
}

function text2Mp3(text) {
  return co.wrap(function* () {
    return yield kkpromise.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: text,
    })
  })()
}

function getQuestionMoney(form_id, is_help, question_token, question_ids) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.getQuestionMoneyUrl, {
      is_help: is_help,
      question_token: question_token,
      question_ids: question_ids,
      form_id: form_id,
    })
  })()
}

function getAnswerMoney(op, question_id, question_token) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.getAnswerMoneyUrl, {
      answer: op,
      question_id: question_id,
      question_token: question_token
    })
  })()
}



function getRedBag(money_id, form_id) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.getRedBagUrl, {
      money_id: money_id,
      form_id: form_id
    })
  })()
}

function changeMoney(money) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.changeMoneyUrl, {
      money: money
    })
  })()
}

function redBagList() {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.redBagListUrl)
  })()
}


function moneyList() {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.moneyListUrl)
  })()
}


function emptyQuestion() {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.emptyQuestionUrl)
  })()
}

function userHelp(form_id, share_user_id) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.userHelpUrl, {
      form_id: form_id,
      share_user_id: share_user_id
    })
  })()
}


function userRedBag(form_id, share_user_id) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.userRedBagUrl, {
      share_user_id: share_user_id,
      form_id: form_id
    })
  })()
}

function userGetMoney(share_user_id) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.userGetMoneyUrl, {
      share_user_id: share_user_id
    })
  })()
}

function screenShot(path, extra) {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.screenShotUrl, {
      path: path,
      extra: extra
    })
  })()
}


module.exports = {
  authPermission: authPermission,
  login: login,
  reLogin: reLogin,
  getUserInfo: getUserInfo,
  getTopList: getTopList,
  getPrizeList: getPrizeList,
  getPrizeRecordList: getPrizeRecordList,
  getAppInfo: getAppInfo,
  postScore: postScore,
  changeGift: changeGift,
  complain: complain,
  getQuestionList: getQuestionList,
  share: share,
  getuserSignInfo: getuserSignInfo,
  userSignIn: userSignIn,
  text2Mp3: text2Mp3,
  getQuestionMoney: getQuestionMoney,
  getAnswerMoney: getAnswerMoney,
  changeMoney: changeMoney,
  getRedBag: getRedBag,
  moneyList: moneyList,
  redBagList: redBagList,
  emptyQuestion: emptyQuestion,
  userHelp: userHelp,
  userRedBag: userRedBag,
  userGetMoney: userGetMoney,
  screenShot: screenShot
}
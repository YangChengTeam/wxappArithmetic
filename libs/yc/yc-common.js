// Author: 张凯

const md5 = require('../md5/md5.js')
const sha256 = require('../sha256/lib/sha256.js')

function encrypt(data){
    let keys = Object.keys(data).sort()
    let result = ''
    for (let i = 0; i < keys.length; i++) {
        result += keys[i] + '=' + data[keys[i]]
        if(i != keys.length - 1){
            result += '&'
        }
    }
    return md5(sha256(result))
}

 

module.exports = {
    encrypt: encrypt
}
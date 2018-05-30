微信小程序通用项目
---



异步同步化
---

避免回调地狱<br/>
- co库<br/>
是一个利用generator functions实现的控制流库<br/>
大量使用在异步同步化代码中。<br/>
[项目地址](https://github.com/tj/co)<br/>


- regenerator库 <br/>
微信小程序支持部分ES6特性，不支持generator functions <br/>
所以需要导入generator-runtime以支持运行<br/>
[项目地址](https://github.com/facebook/regenerator)<br/>

- Promise化<br/>
微信小程序中的有很多异步函数<br/>
我们需要将它们Promise化之后提供给co库使用。

- 示例<br/>
[app.js](app.js)


```
 test(){
    const regeneratorRuntime = global.regeneratorRuntime = require('libs/runtime')
    const co = require('libs/co')
    const kk = require('libs/kk')
    co(function* () {
        var arr = [yield kk.login(),
        yield kk.request({url: 'https://raw.githubusercontent.com/feiyouAndroidTeam/testcoinmp/master/test.json'})]
        console.log(arr)
    })
  }
```

加密部分
---
服务端通信部分





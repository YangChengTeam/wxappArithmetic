// compoents/dialog/dialog.js.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     show: {
         type: Number,
         value: 0,
         observer: function (value) {
            if(value){
              this.toogle(1)
            } else {
              this.toogle(0)
            }
         }
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationDataMask: {},
    animationData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toogle(opacity){
       var animation = wx.createAnimation({
         duration: 500,
         timingFunction: 'ease',
       })
       this.animation = animation
       animation.opacity(opacity).top(opacity == 0 ? "-100%" : 0).step()

       var animationMask = wx.createAnimation({
         duration: 0,
         timingFunction: 'ease',
       })
       this.animationMask = animationMask
       animationMask.opacity(opacity).top(opacity == 0 ? "-100%" : 0).step()

       this.setData({
         animationData: animation.export(),
         animationDataMask: animationMask.export()
       })
     }
  }
})

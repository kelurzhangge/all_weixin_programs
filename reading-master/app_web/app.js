//app.js
App({
  onLaunch: function () {
    console.log("onLaunch is run")
    // 展示本地存储能力

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    /*
      (1) 当接用接口wx.login成功后，就会调用一个回调函数“success”,success回调函数返回一个对象res（假设名叫res），这个对象如下所示：
      Object{code:"the code"  errMsg:"login:ok"}
      (2) 回调函数具体的定义为：函数A作为参数(函数引用)传递到另一个函数B中，并且这个函数B执行函数A。我们就说函数A叫做回调函数。如果没有名称(函数表达式)，就叫做匿名回调函数。

    */
    wx.login({
      
      success: res => {
        console.log("wx.login is run")
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }

    })

    // 获取用户信息
    wx.getSetting({
      // console.log("wx.getSetting is run")
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({

            success: res => {
              console.log("getUserInfo is run")
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况

              if (this.userInfoReadyCallback) {
                //回调

                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function () {

  },
  globalData: {
    userInfo: null
  }
})
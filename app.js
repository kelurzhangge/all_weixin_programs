//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    //获取本地缓存logs为数组
    var logs = wx.getStorageSync('logs') || []
    //unshift向数组添加一个元素并且返回数组新的长度
    logs.unshift(Date.now())
    //将logs写入缓存，覆盖掉原本的Logs内容
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})
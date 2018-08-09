//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    progress: 0
  },
  
  onLoad: function () {
    // progressNum
    var that = this
    var bgm_file_path = wx.getStorageSync('bgm_file_path');
    if (bgm_file_path) {
      console.log("bgm_file_path exist!")
      wx.redirectTo({
        url: '/pages/snake/snake?have_download=1&savedFilePath='+bgm_file_path
      })
    } else {
      console.log("bgm_file_path need download!")
      const downloadTask = wx.downloadFile({
      url: 'http://jsdx.sc.chinaz.com/Files/DownLoad/sound1/201610/7895.wav',  //4.几M大小
      //url:'http://jsdx.sc.chinaz.com/Files/DownLoad/sound1/201610/7896.wav',
      success: function(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
            console.log("iamhere "+res.statusCode+" "+res.tempFilePath)
            if (that.data.progress == 100) {
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function(res) {
                  var savedFilePath = res.savedFilePath
                  console.log("iamhere savedFilePath is "+savedFilePath)
                  wx.setStorageSync('bgm_file_path', savedFilePath)
                  wx.redirectTo({
                    url: '/pages/snake/snake?have_download=1&savedFilePath='+savedFilePath
                  })
                }
              })
            }
        }
      },
      fail: function() {
            console.log("fail interface")
            wx.redirectTo({
              url: '/pages/snake/snake?have_download=0'
            })
        }
      })
      //设置下载任务超时时间，这里为了调试不加此代码块
      /*setTimeout(function(){
        downloadTask.abort() // 取消下载任务
        
        wx.redirectTo({
          url: '/pages/snake/snake?have_download=0'
        })
      },15000)*/

      downloadTask.onProgressUpdate((res) => {
          console.log("enter onProgressUpdate function")
          //并且把当前的进度值设置到progress中
          that.setData({
            progress: res.progress
          })
          
          console.log('下载进度', res.progress)
          console.log('已经下载的数据长度', res.totalBytesWritten)
          console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
      })
    }
  }
})

// 获取全局应用程序实例对象
const douban = require('../../libraries/douban.js')

//创建页面实例对象
Page({
	/*页面的初始数据*/
	data: {
		movies: [],
		loading: true
	},

	/*生命周期函数---监听页面加载*/
	onLoad() {
		douban.find('coming_soon', 1, 3)
			.then(d => this.setData({movies: d.subjects, loading: false }))
			.catch(e => {
				console.error(e)
				this.setData({ movies: [], loading: false })
			})
	},

	start: function (){
		console.log("ener start func")
		wx.redirectTo({ url: '/pages/board/board' })
	},
	/*生命周期函数---监听页面初次渲染完成*/
	onReady() {
		//TODO: onReady
	},

	/*生命周期函数---监听页面显示*/
	onShow() {
		//TODO: onShow
	},

	/*生命周期函数---监听页面隐藏*/
	onHide() {
		//TODO: onUnload
	},

	/*页面相关事件处理函数---监听用户下拉动作*/
	onPullDownRefresh() {
		//TODO: onPullDownRefresh
	}
})
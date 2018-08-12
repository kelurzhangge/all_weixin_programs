const douban = require('../../libraries/douban.js')

//获取全局应用程序实例对象
const app = getApp()

//创建页面实例对象
Page({
	/*页面的初始数据*/
	data: {
		boards: [
			{ key: 'in_theaters', name: '正在热映' },
			{ key: 'coming_soon', name: '即将上映' },
			{ key: 'top250', name:'TOP250' },
			//{ key: 'new_movies', name: '新片榜'},
			{ key: 'us_box', name: '北美票房榜' },
		],
		movies: [],
		loading: true
	},
	/*生命周期函数---监听页面加载*/
	onLoad() {
		douban.find('in_theaters', 1, 5)
			.then(d => this.setData({ movies: d.subjects, loading: false }))
			.catch(e => {
				console.error(e)
				this.setData({ movies: [], loading: false })
			})
	},
})
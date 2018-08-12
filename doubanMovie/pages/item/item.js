//Douban API 操作
const douban = require('../../libraries/douban.js')

//创建一个页面对象用于控制页面的逻辑
 Page ({
 	data: {
 		title: '',
 		loading: true,
 		movie: {}
 	},

 	onLoad (params) {
 		console.log("iamhere enter onLoad func")
 		//注意！这里的findOne里面调用了wx.request,并不会阻塞在请求过程中，而是直接向下执行，也就是说
 		//findOne中的setData和onReady()不一定是谁先执行，这也就会导致数据显示不出来，所以，解决办法
 		//直接将onReady中的执行代码放在setData()之后，保证先设置再获取。
 		douban.findOne(params.id)
 			.then(d => {
 				//console.log("iamhere before setData ")
 				this.setData({ country: d.countries, title: d.title, movie: d, loading: false })
 				wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
 			})
 			.catch(e => {
 				this.setData({ title: '获取数据异常', movie: {}, loading: false })
 				wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
 				console.error(e)
 			})
 		
 	}/*,

 	onReady() {
 		wx.setNavigationBarTitle({ title: this.data.title + ' << 电影 << 豆瓣' })
 	}*/
 })
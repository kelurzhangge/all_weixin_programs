const API_URL = 'http://t.yushu.im/v2/movie'

function fetchApi(type, params) {
	console.log("iamhere fetchApi type is "+type)
	return new Promise((resolve, reject) => {
		wx.request ({
			url:`${API_URL}/${type}`,
			data: Object.assign({}, params),
			header: { 'Content-Type': 'application/json' },
			success: resolve,
			fail: reject
		})
	})
}

module.exports = {
	find (type, page = 1, count = 20, search = '') {
		const params = { start: (page - 1) * count, count: count }
		return fetchApi(type, search ? Object.assign(params, { q: search }) : params)
			.then(res => res.data)
	},

	findOne(id) {
		console.log("id is "+ id)
		var ret = fetchApi('subject/' + id)
			.then(res => res.data)
		console.log("iamhere after fetchApi func")
		return ret
	}
}
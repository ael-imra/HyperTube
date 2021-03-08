const rarbg = require('rarbg-api')

rarbg
	.list{(
		category: '',
		limit: 2,
		format: 'json_extended',
		sort: 'year',
	})
	.then((data) => console.log(data))

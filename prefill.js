var db = require('./src/lib/db');

//db.db.sync({force: true});

var data = [
	{ name: 'candy', tags: ''
		, items: [
			{ name: 'test candy123', tags: '' },
			{ name: '123 candy', tags: '' },
			{ name: '435 candy', tags: '' }
		]
	},

	{ name: 'knight', tags: ''
		, items: [
			{ name: 'item knight1', tags: '' },
			{ name: 'item knight2', tags: '' },
			{ name: 'item knight3', tags: '' }
		]
	},
	{ name: 'fae', tags: ''
		, items: [
			{ name: 'test fae' },
			{ name: 'test fae1' },
			{ name: 'test fae2' },
		]
	}
];

data.forEach(function(category) {
	db.Category
		.create({ name: category.name })
		.then(function(cat) {
			console.log('wrote', cat.name);

			category.items.forEach(function(item) {
				db.Item
					.create({ name: item.name, defaultCost: 25000, defaultPrice: 50000 })
					.then(function(i) {
						console.log('wrote item', i.name);
					})
					.catch(function(err) {
						console.log('there was an error');
					});
			});
		})
});

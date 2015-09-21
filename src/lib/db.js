var settings = require('../../settings.json');
var Seq = require('sequelize');

var env = (typeof window !== 'undefined' && window.process.env) || process.env;
if (env.NODE_ENV === 'development') {
	console.log('using development database');

	settings.db_hostname = '127.0.0.1';
	settings.db_user = 'inventorydev';
	settings.db_password = 'inventorydev';
}

var seq = new Seq(settings.db_name, settings.db_user, settings.db_password, {
	host: settings.db_hostname,
	dialect: 'postgres',
	pool: {
		max: 5,
		min: 1,
		idle: 10000
	}
});

exports.db = seq;

/*
	Category of items
 */
exports.Category = seq.define('category', {
	id: {  type: Seq.UUID, primaryKey: true, unique: true, defaultValue: Seq.UUIDV4 },
	name: { type: Seq.STRING, unique: true, allowNull: false },
	tags: { type: Seq.STRING, allowNull: true }
});

exports.Item = seq.define('item', {
	id: {  type: Seq.UUID, primaryKey: true, unique: true, defaultValue: Seq.UUIDV4 },
	name: { type: Seq.STRING, unique: true, allowNull: false },
	defaultCost: { type: Seq.INTEGER, allowNull: false },
	defaultPrice: { type: Seq.INTEGER, allowNull: false },
	tags: { type: Seq.STRING, allowNull: true }
});

/*
	An inventory of Items that come in stock
 */
exports.Stock = seq.define('stock', {
	id: {  type: Seq.UUID, primaryKey: true, unique: true, defaultValue: Seq.UUIDV4 },
	cost: { type: Seq.INTEGER, allowNull: false },
	stockedDate: { type: Seq.DATE, allowNull: false, defaultValue: Seq.NOW },

	soldPrice: { type: Seq.INTEGER, allowNull: true },
	note: { type: Seq.STRING, allowNull: true },
	soldDate: { type: Seq.DATE, allowNull: true },

	available: { type: Seq.BOOLEAN , allowNull: false, defaultValue: true },
});


//exports.Category.hasMany(exports.Item, { as: 'Items' });
//exports.Item.belongsTo(exports.Category);
exports.Item.hasMany(exports.Stock, { as: 'Stocks' });
exports.Stock.belongsTo(exports.Item);

seq.sync();
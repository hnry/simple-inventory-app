var settings = require('settings.json');
var Seq = require('sequelize');

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
	name: { type: Seq.STRING, allowNull: false },
	tags: { type: Seq.STRING, allowNull: false }
});

Category.hasMany(Item, { as: 'Items' });

exports.Item = seq.define('item', {
	id: {  type: Seq.UUID, primaryKey: true, unique: true, defaultValue: Seq.UUIDV4 },
	name: { type: Seq.STRING, allowNull: false },
});

Item.belongsTo(Category);
Item.hasMany(Stock, { as: 'Stocks' });

/*
	An inventory of Items that come in stock
 */
exports.Stock = seq.define('stock', {
	id: {  type: Seq.UUID, primaryKey: true, unique: true, defaultValue: Seq.UUIDV4 },
	itemId: {}, // belongs to Item
	cost: { type: Seq.INTEGER, allowNull: false },
	stockedDate: { type: Seq.DATE, allowNull: false, defaultValue: Seq.NOW }
	available: { type: Seq.BOOL , allowNull: false, defaultValue: true },
});

Stock.hasOne(Order);

/*
	Where orders are stored
 */
exports.Order = seq.define('order', {
	id: {  type: Seq.UUID, primaryKey: true, unique: true, defaultValue: Seq.UUIDV4 },
	price: { type: Seq.INTEGER, allowNull: false },
	note: { type: Seq.STRING, allowNull: false },
	soldDate: { type: Seq.DATE, allowNull: false, defaultValue: Seq.NOW }
});

Order.belongsTo(Stock);

seq.sync();
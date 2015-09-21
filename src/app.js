var db = require('./lib/db');
//var remote = require('remote');
var ipc = window.require('ipc');

var SearchBar = require('./search');
var DisplayInventory = require('./displayInv');

var App = React.createClass({

	styles: {

	},

	getInitialState: function() {
		return { 
			cateogories: [],
			items: [],
			stocks: [],
			search: '' 
		};
	},

	componentDidMount: function() {
		var that = this;

		db.Item.all().then(function(result) {
			that.setState({ items: result });
		});

		db.Stock.findAll({ where: {available: true} }).then(function(result) {
			that.setState({ stocks: result });
		});
	},

	handleAddClick: function() {
		ipc.send('create-item');
	},

	onSearch: function(searchValue) {
		this.setState({ search: searchValue });
	},

	render: function() {
		return (
			<div>
				<SearchBar handleSearch={this.onSearch} />
				<DisplayInventory searchTerm={this.state.search} items={this.state.items} stocks={this.state.stocks} />

				<hr />

			  <div className='row'>
	        <div className='col-xs-12'>
					  <button id='itemadd' onClick={this.handleAddClick}>Create New Item</button>
				  </div>
			  </div>

			</div>
		);
	}

});

React.render(<App />, document.getElementById('app'));
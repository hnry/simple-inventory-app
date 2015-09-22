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

	updateData: function() {
		ipc.send('data-request', {
			dbName: 'Item',
			all: true,
			targetWindow: 'mainWindow',
			targetEvent: 'item-all'
		});

		ipc.send('data-request', {
			dbName: 'Stock',
			all: true,
			dbOptions: { 
				where: { available: true } 
			},
			targetWindow: 'mainWindow',
			targetEvent: 'stock-all'
		});
	},

	componentDidMount: function() {
		const that = this;

		ipc.on('item-all', function(err, result) {
			that.setState({ items: result });
		});

		ipc.on('stock-all', function(err, result) {
			if (!result) result = [];
			that.setState({ stocks: result });
		});

		ipc.on('refresh', this.updateData);
		this.updateData();
	},

	handleAddClick: function() {
		ipc.send('create-item');
	},

	openExportWin: function() {
		ipc.send('export-win');
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
					  <button id='itemadd' onClick={this.handleAddClick}>Create New Item / Category</button>
  				  <button onClick={this.openExportWin}>Export Inventory</button>
				  </div>
			  </div>

			</div>
		);
	}

});

React.render(<App />, document.getElementById('app'));
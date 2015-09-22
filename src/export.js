var ipc = window.require('ipc');

class Export extends React.Component {

	constructor() {
		super();
		this.state = {
			items: [],
			categories: [],
			stocks: []
		}
	}

	componentWillMount() {
		const that = this;

		ipc.on('item-all', function(err, items) {
			that.setState({ items: items });
		});

		ipc.on('category-all', function(err, categories) {
			that.setState({ categories: categories });
		});

		ipc.on('stock-all', function(err, stocks) {
			that.setState({ stocks: stocks });
		});

		this.updateData();
	}

	updateData() {
		ipc.send('data-request', {
			dbName: 'Item',
			all: true,
			targetWindow: 'exportWindow',
			targetEvent: 'item-all'			
		});
		ipc.send('data-request', {
			dbName: 'Category',
			all: true,
			targetWindow: 'exportWindow',
			targetEvent: 'category-all'			
		});
		ipc.send('data-request', {
			dbName: 'Stock',
			all: true,
			targetWindow: 'exportWindow',
			targetEvent: 'stock-all'			
		});
	}

	export() {
		let ret = '';
		this.state.categories.forEach(category => {
			ret += '>  ' + category.name + '\n';

			// get all items for this category
			const items = this.state.items.filter(item => {
				if (item.categoryId === category.id) {
					return true;
				}
				return false;
			});

			items.forEach(item => {
				// see if there's stock
				const stock = this.state.stocks.filter(stock => {
					if (stock.itemId === item.id && stock.available) {
						return true;
					}
					return false;
				});
				let price = 'sold out';
				if (stock.length) price = item.defaultPrice;

				ret += '* ' + item.name + '    _' + price + '_ \n';
			});

			ret += '\n\n';
		});

		return ret;
	}

	render() {
		return (
		  <div className='row'>
        <div className='col-xs-12'>

			  	<textarea id='export-text' readOnly value={this.export()}>
			  	</textarea>

				</div>
		  </div>
		);
	}
}

React.render(<Export />, document.getElementById('app'));
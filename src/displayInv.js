var ipc = window.require('ipc');

class DisplayInventory extends React.Component {

	constructor() {
		super();

		this.styles = {
			list_item_row: 'list-item-row',
			list_item_stock: 'list-item-stock',
			list_item_price: 'list-item-price',
		}

		this.state = {
			items: [],
			stocks: []
		}

	}

	componentWillReceiveProps(nextProps) {
		function getStockCount(itemId) {
			return nextProps.stocks.reduce((prev, curr) => {
				if (curr.itemId === itemId) {
					return prev + 1;
				} else {
					return prev;
				}
			}, 0);
		}

		nextProps.items.forEach((item, idx) => {
			const count = getStockCount(item.id);
			nextProps.items[idx].stockCount = count;
		});

		this.setState({ items: nextProps.items, stocks: nextProps.stocks });
	}

	itemClick(item) {
		ipc.send('edit-item', item.id);
	}

	calcInStock() {
		return this.state.items.reduce((prev, curr) => {
			return prev + curr.stockCount;
		}, 0);
	}

	calcUniqueStock() {
		const uniq = this.state.items.filter(item => {
			return item.stockCount;
		}).length;

		return uniq + ' / ' + this.state.items.length;
	}

	calcStockCost() {
		return this.state.stocks.reduce((prev, curr) => {
			if (curr.available) {
				return prev + curr.cost;
			}

			return prev;
		}, 0);
	}

	calcTotalPrice() {
		return this.state.items.reduce((prev, curr) => {
			if (curr.stockCount) {
				const t = curr.stockCount * curr.defaultPrice;
				return prev + t;
			} else {
				return prev;
			}
		}, 0);
	}

	renderItems() {
		let items = this.state.items;

		// filter for search
		if (this.props.searchTerm) {
			items = this.props.items.filter(item => {
				if (item.name.toLowerCase().indexOf(this.props.searchTerm.toLowerCase()) !== -1) {
					return true;
				}
				return false;
			});
		}

		// filter by inventory/stock count
		items = items.filter(item => {
			if (item.stockCount) {
				return true;
			}

			// if also searching, show all items, whether
			// it has stock or not
			if (this.props.searchTerm) {
				return true;
			}

			return false;
		});

		const result = items.map(item => {
			return (
				<div key={item.id} onClick={this.itemClick.bind(this, item)} className={this.styles.list_item_row}>
					<span className={'pull-left ' + this.styles.list_item_stock}>{item.stockCount}</span>
					<span>{item.name}</span>
					<span className={'pull-right ' + this.styles.list_item_price}>{item.defaultPrice}</span>
				</div>
			);
		});

		if (result.length) {
			return result;
		} else {
			// no results to show
			return (<div>No inventory :(</div>)
		}
	}

	render() {
		return (
			<div>
			{/* Display stats of available / total or something */}
		  <div className='row'>
        <div className='col-xs-12'>
        	In Stock: {this.calcInStock()}
        	<br />
        	Unique Stock: {this.calcUniqueStock()}
        	<br />
        	Total Stock Cost: {this.calcStockCost()}
        	<br />
        	Total Sell Price: {this.calcTotalPrice()}
			  </div>
		  </div>

		  <hr />

			{/* Display available inventory */}
		  <div className='row'>
        <div className='col-xs-12'>
        	{this.renderItems()}
				</div>
		  </div>
		  </div>
		);
	}
}

export default DisplayInventory;
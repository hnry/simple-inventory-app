var ipc = window.require('ipc');
var qs = require('querystring');

class EditApp extends React.Component {

  constructor() {
    super();
    this.handleInputName = this.handleInputName.bind(this);
    this.handleInputCost = this.handleInputCost.bind(this);
    this.handleInputPrice = this.handleInputPrice.bind(this);
    this.handleInputCustomPrice = this.handleInputCustomPrice.bind(this);

    this.state = {
      category: { name: '' },
      item: {},
      stocks: [],
      // local state for this component
      id: 0,
      local: {
        name: '',
        defaultCost: 0,
        defaultPrice: 0
      }
    }
  }

  componentWillMount() {
    var query = document.location.href.split('?');
    var id = qs.parse(query[1]).id;

    const that = this;

    ipc.on('category', function(err, result) {
      if (result) that.setState({ category: result });
    });

    ipc.on('stocks', function(err, result) {
      if (result) that.setState({ stocks: result });
    });

    ipc.on('item', function(err, item) {
      if (!err && item) {
        that.setState({
          id: item.id,
          item: item, 
          local: {
            name: item.name,
            defaultCost: item.defaultCost,
            defaultPrice: item.defaultPrice,
            customPrice: item.defaultPrice
          }
        });

        ipc.send('data-request', {
          dbName: 'Category',
          all: false,
          dbOptions: { where: { id: item.categoryId}},
          targetWindow: 'editWindow',
          targetEvent: 'category'
        });
      }
    });

    ipc.on('stock-create', function(err, stock) {
      if (!err) {
        that.updateData();
        that.refreshMainWin();
        alert('Successfully added 1 stock');
      } else {
        alert('There was an error ' + err);
      }
    });

    ipc.on('item-update', function(err, result) {
      if (!err) {
        that.updateData();
        that.refreshMainWin();
        alert('Item details updated.');
      } else {
        alert('Updating item failed, with error: ' + err);
      }
    });

    ipc.on('stock-sell', function(err, stock) {
      if (!err) {
        that.updateData();
        that.refreshMainWin();
        alert('Successfully sold 1 stock');
      } else {
        alert('Selling Stock error, ' + err);
      }
    });

    // get initial data
    this.updateData(id);
  }

  refreshMainWin() {
    ipc.send('refresh');
  }

  updateData(id) {
    id = id || this.state.id;

    ipc.send('data-request', {
      dbName: 'Item',
      all: false,
      dbOptions: { where: { id: id }},
      targetWindow: 'editWindow',
      targetEvent: 'item'
    });

    ipc.send('data-request', {
      dbName: 'Stock',
      all: true,
      dbOptions: { where: { itemId: id }},
      targetWindow: 'editWindow',
      targetEvent: 'stocks'
    });
  }

  addStock() {
    if (!this.state.id) {
      return;
    }
    let cost = this.state.item.defaultCost;

    if (!cost && cost !== 0) {
      alert('Must have cost.');
      return;
    }

    ipc.send('data-write', {
      dbName: 'Stock',
      create: true,
      data: {
        itemId: this.state.id,
        cost: cost
      },
      targetWindow: 'editWindow',
      targetEvent: 'stock-create'
    });
  }

  sellStock() {
    const notes = React.findDOMNode(this.refs.sellNote).value;
    const soldPrice = React.findDOMNode(this.refs.sellPrice).value;

    if (!soldPrice) {
      alert('Must have a sell price.');
      return;
    }

    const that = this;

    ipc.send('data-write', {
      dbName: 'Stock',
      create: false,
      all: true,
      dbOptions: {
        where: { itemId: this.state.id , available: true },
        order: [["stockedDate","ASC"]],
        limit: 1
      },
      data: {
        available: false,
        soldPrice: soldPrice,
        soldDate: Date.now(),
        notes: notes
      },
      targetWindow: 'editWindow',
      targetEvent: 'stock-sell'
    });
  }

  closeWindow() {
    ipc.send('close-edit-win');
  }

  getStockCount() {
    return this.state.stocks.filter(stock => {
      return stock.available;
    }).length;
  }

  calculateHistoricalAvg() {
    return '?';
  }

  calculateAvgProfit() {
    return '?';
  }

  calculateTurnaroundTime() {
    return '?';
  }

  handleInputName(event) {
    this.state.local.name = event.target.value;
    this.setState({ local: this.state.local });
  }

  handleInputCost(event) {
    this.state.local.defaultCost = event.target.value;
    this.setState({ local: this.state.local });
  }

  handleInputPrice(event) {
    this.state.local.defaultPrice = event.target.value;
    this.setState({ local: this.state.local });
  }

  handleInputCustomPrice(event) {
    this.state.local.customPrice = event.target.value;
    this.setState({ local: this.state.local });
  }

  saveItem() {
    const that = this;

    ipc.send('data-write', {
      dbName: 'Item',
      create: false,
      dbOptions: { where: { id: this.state.id }},
      data: {
        name: this.state.local.name,
        defaultCost: this.state.local.defaultCost,
        defaultPrice: this.state.local.defaultPrice
      },
      targetWindow: 'editWindow',
      targetEvent: 'item-update'
    });
  } 

  canUserSave() {
    const actual = this.state.item;
    const local = this.state.local;
    const keys = ['name', 'defaultCost', 'defaultPrice'];

    const results = keys.filter(k => {
      if (local[k]) {
        if (local[k] != actual[k]) {
          return true;
        }
      }
      return false;
    });

    if (results.length) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <div>
      <div className='row'>
        <div className='col-xs-12'>
          <h3>{this.state.category.name}</h3>
        </div>
      </div>

      <div className='row'>
        <div className='col-xs-12'>
          <label>Item Name:</label>
          <br />
          <input type='text' onChange={this.handleInputName} value={this.state.local.name} />
          <br />
          <label>Item Cost:</label>
          <br />
          <input type='text' value={this.state.local.defaultCost} onChange={this.handleInputCost} />
          <br />
          <label>Item Sell Price:</label>
          <br />
          <input type='text' value={this.state.local.defaultPrice} onChange={this.handleInputPrice} />
          <br />
          <button onClick={this.saveItem.bind(this)} disabled={this.canUserSave()}>Save</button>
        </div>
      </div>

      <hr />

      {/* stats, historical average price, sell frequency? */}
      <div className='row'>
        <div className='col-xs-12'>
          <label>Historical Avg. Price:</label> {this.calculateHistoricalAvg()}
          <br />
          <label>Avg. Profit:</label> {this.calculateAvgProfit()}
          <br />
          <label>Turnaround Time:</label> {this.calculateTurnaroundTime()} days
        </div>
      </div>

      {/* input to edit available stock & sell price */}
      <div className='row'>
        <div className='col-xs-6'>
          <label>Available:</label> {this.getStockCount()}
        </div>
      </div>

      <hr />

      {/* sell section, price sold, notes */}
      <div className='row'>
        <div className='col-xs-6'>
          <label>Sell Price:</label>
          <br />
          <input type='text' ref='sellPrice' value={this.state.local.customPrice} onChange={this.handleInputCustomPrice} placeholder='Sell price' />
        </div>
        <div className='col-xs-6'>
          <label>Sell Notes:</label>
          <br />
          <input type='text' ref='sellNote' placeholder='Notes' />
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12'>
          <button onClick={this.sellStock.bind(this)}>Sell 1 Stock</button>
        </div>
      </div>

      <hr />

      {/* add a stock */}
      <div className='row'>
        <div className='col-xs-12'>
          <label>Cost:</label> {this.state.item.defaultCost}
          <br />
          <button onClick={this.addStock.bind(this)}>Add 1 Stock</button>
          <hr />
          <button onClick={this.closeWindow.bind(this)}>Close Window</button>
        </div>
      </div>

      </div>
    );
  }
}

React.render(<EditApp />, document.getElementById('app'));
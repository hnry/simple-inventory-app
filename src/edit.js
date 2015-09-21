var ipc = window.require('ipc');
var db = require('./lib/db');
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
    this.updateState(id);
  }

  updateState(id) {
    id = id || this.state.id;

    const that = this;
    db.Item.findOne({ where: { id: id }})
        .then(function(item) {
          that.setState({ 
            id: id, 
            item: item, 
            local: {
              name: item.name,
              defaultCost: item.defaultCost,
              defaultPrice: item.defaultPrice,
              customPrice: item.defaultPrice
            }
          });

          db.Category.findOne({ where: { id: item.categoryId}})
            .then(function(category) {
              that.setState({ category: category });
            });

          db.Stock.findAll({ where: { itemId: id }})
              .then(function(results) {
                that.setState({ stocks: results });
              });

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

    const that = this;
    db.Stock.create({
      itemId: this.state.id,
      cost: cost,
    }).then(function(stock) {
      that.updateState();
      alert('Successfully added 1 stock');
    }).catch(function(err) {
      alert('There was an error ' + err);
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
    db.Stock.findAll({
      where: { itemId: this.state.id , available: true },
      order: [["stockedDate","ASC"]],
      limit: 1
    }).then(function(result) {
      if (!result.length) {
        alert('Nothing to sell');
        return;
      }
      result[0].set('available', false);
      result[0].set('soldPrice', soldPrice);
      result[0].set('soldDate', Date.now());
      result[0].set('note', notes);
      result[0].save().then(function() {
        that.updateState();
        alert('Successfully sold 1 stock');
      }).catch(function(err) {
        alert('sellStock update error ' + err);
      });
    }).catch(function(err) {
      alert('sellStock error ' + err);
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

    db.Item.update({
      name: this.state.local.name,
      defaultCost: this.state.local.defaultCost,
      defaultPrice: this.state.local.defaultPrice
    }, { where: { id: this.state.id }})
    .then(function(item) {
      // could avoid doing an additional database fetch
      // and just use 'item' here and setState manually?
      // TODO
      that.updateState();
      alert('Item details updated.');
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
          <label for=''>Cost:</label> {this.state.item.defaultCost}
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
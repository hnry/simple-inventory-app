var ipc = window.require('ipc');
var db = require('./lib/db');

class CreateApp extends React.Component {

  constructor() {
    super();
    this.state = {
    }
  }

  componentWillMount() {

  }

  closeWindow() {
    ipc.send('close-create-win');
  }

  render() {
    return (
      <div>
      {/* category search / input bar */}
      <div className='row'>
        <div className='col-xs-12'>
          <input type='text' />
        </div>
      </div>

      {/* save new category button */}
      <div className='row'>
        <div className='col-xs-12'>
          <button>Add New Category</button>
        </div>
      </div>

      <hr />

      {/* category search / input bar */}
      <div className='row'>
        <div className='col-xs-12'>
          <label for='create-new-item-input'>Item Name:</label>
          <input type='text' id='create-new-item-input' />
        </div>
      </div>

      <div className='row'>
        <div className='col-xs-12'>
          <button>Add New Item</button>
        </div>
      </div>

      <hr />
      <button onClick={this.closeWindow.bind(this)}>Close Window</button>

      </div>
    );
  }
}

React.render(<CreateApp />, document.getElementById('app'));
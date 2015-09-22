var ipc = window.require('ipc');

class CreateApp extends React.Component {

  constructor() {
    super();
    this.state = {
      // list of database categories
      categories: [],
      // current search value for category
      searchCat: '',
      // selected category
      category: {},

      // value to hold new category name
      categoryName: '',
      // values to hold new item data
      name: '',
      defaultCost: 0,
      defaultPrice: 0
    }
  }

  componentWillMount() {
    const that = this;

    ipc.on('categories', function(err, categories) {
      if (!err) {
        that.setState({ categories: categories });
      } else {
        alert('Unexpected error connecting to database, specifically fetching categories');       
      }
    });

    ipc.on('category-create', function(err, category) {
      if (!err) {
        that.setState({ categoryName: '' });
        that.updateCategories();
        that.clearSelected();
        that.refreshMainWin();
        alert('Success! New Category saved.');
      } else {
        alert('Error saving new category, ' + err);
      }
    });

    ipc.on('item-create', function(err, item) {
      if (!err) {
        that.setState({ name: '', defaultCost: 0, defaultPrice: 0 });
        that.clearSelected();
        that.refreshMainWin();
        alert('Success! New Item saved');
      } else {
        alert('Error saving new item, ' + err);        
      }
    });

    this.updateCategories();
  }

  updateCategories() {
    ipc.send('data-request', {
      dbName: 'Category',
      all: true,
      targetWindow: 'createWindow',
      targetEvent: 'categories'
    }); 
  }

  refreshMainWin() {
    ipc.send('refresh');
  }

  closeWindow() {
    ipc.send('close-create-win');
  }

  clearSelected() {
    this.setState({ category: {} });
  }

  selectCategory(category) {
    this.setState({ category: category });
  }

  handleCategorySearch(event) {
    this.clearSelected();
    this.setState({ searchCat: event.target.value });
  }

  handleCategoryName(event) {
    this.setState({ categoryName: event.target.value });
  }

  handleItemName(event) {
    this.setState({ name: event.target.value });
  }

  handleItemCost(event) {
    this.setState({ defaultCost: event.target.value });
  }

  handleItemPrice(event) {
    this.setState({ defaultPrice: event.target.value });
  }

  saveNewCategory() {
    if (!this.state.categoryName) {
      alert('Must have a name for the new Category');
      return;
    }

    const that = this;
    ipc.send('data-write', {
      dbName: 'Category',
      create: true,
      data: {
        name: this.state.categoryName
      },
      targetWindow: 'createWindow',
      targetEvent: 'category-create'
    });
  }

  saveNewItem() {
    if (!this.state.name) {
      alert('Must have a name for the new Item')
      return;
    }

    if (!this.state.category.id) {
      alert('Item must belong to category, select one first');
      return;
    }

    const that = this;

    ipc.send('data-write', {
      dbName: 'Item',
      create: true,
      data: {
        categoryId: this.state.category.id,
        name: this.state.name,
        defaultPrice: this.state.defaultPrice,
        defaultCost: this.state.defaultCost        
      },
      targetWindow: 'createWindow',
      targetEvent: 'item-create'
    });
  }

  renderCats() {
    let categories = this.state.categories;

    categories = categories.filter(cat => {
      if (cat.name.toLowerCase().indexOf(this.state.searchCat.toLowerCase()) !== -1) {
        return true;
      }
      return false;
    });

    return categories.map(cat => {
      let selected = false;
      if (this.state.category.id === cat.id) {
        selected = true;
      }
      return (
      <option key={cat.id} selected={selected} onClick={this.selectCategory.bind(this, cat)}>
        {cat.name}
      </option>
      );
    });
  }

  render() {
    return (
      <div>

      {/* save new category button */}
      <div className='row'>
        <div className='col-xs-12'>
          <label htmlFor='new_category_input'>Category Name:</label>
          <input type='text' id='new_category_input' value={this.state.categoryName} onChange={this.handleCategoryName.bind(this)} />
          <button onClick={this.saveNewCategory.bind(this)}>Add New Category</button>
        </div>
      </div>

      <hr />

      {/* category search / input bar */}
      <div className='row'>
        <div className='col-xs-12'>
          <input type='text' placeholder='Search category' value={this.state.searchCat} onChange={this.handleCategorySearch.bind(this)} />
          <br />
          <select size='5'>
          {this.renderCats()}
          </select>
        </div>
      </div>

      {/* Item fields */}
      <div className='row'>
        <div className='col-xs-12'>
          <label htmlFor='create-new-item-input'>Item Name:</label>
          <br />
          <input type='text' id='create-new-item-input' value={this.state.name} onChange={this.handleItemName.bind(this)} />
          <br />

          <label htmlFor='cost-new-item-input'>Item Cost:</label>
          <br />
          <input type='text' id='cost-new-item-input' value={this.state.defaultCost} onChange={this.handleItemCost.bind(this)} />
          <br />

          <label htmlFor='price-new-item-input'>Item Sell Price:</label>
          <br />
          <input type='text' id='price-new-item-input' value={this.state.defaultPrice} onChange={this.handleItemPrice.bind(this)} />
        </div>
      </div>

      <div className='row'>
        <div className='col-xs-12'>
          <button onClick={this.saveNewItem.bind(this)}>Add New Item</button>
        </div>
      </div>

      <hr />
      <button onClick={this.closeWindow.bind(this)}>Close Window</button>

      </div>
    );
  }
}

React.render(<CreateApp />, document.getElementById('app'));
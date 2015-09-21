class SearchBar extends React.Component {

	constructor() {
		super();
	}

	search(event) {
		this.props.handleSearch(event.target.value);
	}

	render() {
		return (
		  <div className='row'>
        <div className='col-xs-12'>

			  	<div className='input-group'>
				  	<input type='text' onChange={this.search.bind(this)} className='form-control' />
			  	</div>

				</div>
		  </div>
		);
	}
}

export default SearchBar;
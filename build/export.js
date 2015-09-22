(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ipc = window.require('ipc');

var Export = (function (_React$Component) {
	_inherits(Export, _React$Component);

	function Export() {
		_classCallCheck(this, Export);

		_get(Object.getPrototypeOf(Export.prototype), 'constructor', this).call(this);
		this.state = {
			items: [],
			categories: [],
			stocks: []
		};
	}

	_createClass(Export, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var that = this;

			ipc.on('item-all', function (err, items) {
				that.setState({ items: items });
			});

			ipc.on('category-all', function (err, categories) {
				that.setState({ categories: categories });
			});

			ipc.on('stock-all', function (err, stocks) {
				that.setState({ stocks: stocks });
			});

			this.updateData();
		}
	}, {
		key: 'updateData',
		value: function updateData() {
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
	}, {
		key: 'export',
		value: function _export() {
			var _this = this;

			var ret = '';
			this.state.categories.forEach(function (category) {
				ret += '>  ' + category.name + '\n';

				// get all items for this category
				var items = _this.state.items.filter(function (item) {
					if (item.categoryId === category.id) {
						return true;
					}
					return false;
				});

				items.forEach(function (item) {
					// see if there's stock
					var stock = _this.state.stocks.filter(function (stock) {
						if (stock.itemId === item.id && stock.available) {
							return true;
						}
						return false;
					});
					var price = 'sold out';
					if (stock.length) price = item.defaultPrice;

					ret += '* ' + item.name + '    _' + price + '_ \n';
				});

				ret += '\n\n';
			});

			return ret;
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					'div',
					{ className: 'col-xs-12' },
					React.createElement('textarea', { id: 'export-text', readOnly: true, value: this['export']() })
				)
			);
		}
	}]);

	return Export;
})(React.Component);

React.render(React.createElement(Export, null), document.getElementById('app'));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaC9Eb2N1bWVudHMvY29kZS9pbnZlbnRvcnkvc3JjL2V4cG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUUxQixNQUFNO1dBQU4sTUFBTTs7QUFFQSxVQUZOLE1BQU0sR0FFRzt3QkFGVCxNQUFNOztBQUdWLDZCQUhJLE1BQU0sNkNBR0Y7QUFDUixNQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1osUUFBSyxFQUFFLEVBQUU7QUFDVCxhQUFVLEVBQUUsRUFBRTtBQUNkLFNBQU0sRUFBRSxFQUFFO0dBQ1YsQ0FBQTtFQUNEOztjQVRJLE1BQU07O1NBV08sOEJBQUc7QUFDcEIsT0FBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixNQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDdkMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLENBQUMsQ0FBQzs7QUFFSCxNQUFHLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxVQUFTLEdBQUcsRUFBRSxVQUFVLEVBQUU7QUFDaEQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQzs7QUFFSCxNQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFTLEdBQUcsRUFBRSxNQUFNLEVBQUU7QUFDekMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQzs7QUFFSCxPQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDbEI7OztTQUVTLHNCQUFHO0FBQ1osTUFBRyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDeEIsVUFBTSxFQUFFLE1BQU07QUFDZCxPQUFHLEVBQUUsSUFBSTtBQUNULGdCQUFZLEVBQUUsY0FBYztBQUM1QixlQUFXLEVBQUUsVUFBVTtJQUN2QixDQUFDLENBQUM7QUFDSCxNQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN4QixVQUFNLEVBQUUsVUFBVTtBQUNsQixPQUFHLEVBQUUsSUFBSTtBQUNULGdCQUFZLEVBQUUsY0FBYztBQUM1QixlQUFXLEVBQUUsY0FBYztJQUMzQixDQUFDLENBQUM7QUFDSCxNQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN4QixVQUFNLEVBQUUsT0FBTztBQUNmLE9BQUcsRUFBRSxJQUFJO0FBQ1QsZ0JBQVksRUFBRSxjQUFjO0FBQzVCLGVBQVcsRUFBRSxXQUFXO0lBQ3hCLENBQUMsQ0FBQztHQUNIOzs7U0FFSyxtQkFBRzs7O0FBQ1IsT0FBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsT0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ3pDLE9BQUcsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7OztBQUdwQyxRQUFNLEtBQUssR0FBRyxNQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQzdDLFNBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxRQUFRLENBQUMsRUFBRSxFQUFFO0FBQ3BDLGFBQU8sSUFBSSxDQUFDO01BQ1o7QUFDRCxZQUFPLEtBQUssQ0FBQztLQUNiLENBQUMsQ0FBQzs7QUFFSCxTQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJOztBQUVyQixTQUFNLEtBQUssR0FBRyxNQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQy9DLFVBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDaEQsY0FBTyxJQUFJLENBQUM7T0FDWjtBQUNELGFBQU8sS0FBSyxDQUFDO01BQ2IsQ0FBQyxDQUFDO0FBQ0gsU0FBSSxLQUFLLEdBQUcsVUFBVSxDQUFDO0FBQ3ZCLFNBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQzs7QUFFNUMsUUFBRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDO0tBQ25ELENBQUMsQ0FBQzs7QUFFSCxPQUFHLElBQUksTUFBTSxDQUFDO0lBQ2QsQ0FBQyxDQUFDOztBQUVILFVBQU8sR0FBRyxDQUFDO0dBQ1g7OztTQUVLLGtCQUFHO0FBQ1IsVUFDRTs7TUFBSyxTQUFTLEVBQUMsS0FBSztJQUNoQjs7T0FBSyxTQUFTLEVBQUMsV0FBVztLQUU1QixrQ0FBVSxFQUFFLEVBQUMsYUFBYSxFQUFDLFFBQVEsTUFBQSxFQUFDLEtBQUssRUFBRSxJQUFJLFVBQU8sRUFBRSxBQUFDLEdBQzlDO0tBRVA7SUFDQSxDQUNOO0dBQ0Y7OztRQTlGSSxNQUFNO0dBQVMsS0FBSyxDQUFDLFNBQVM7O0FBaUdwQyxLQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFDLE1BQU0sT0FBRyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgaXBjID0gd2luZG93LnJlcXVpcmUoJ2lwYycpO1xuXG5jbGFzcyBFeHBvcnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdGl0ZW1zOiBbXSxcblx0XHRcdGNhdGVnb3JpZXM6IFtdLFxuXHRcdFx0c3RvY2tzOiBbXVxuXHRcdH1cblx0fVxuXG5cdGNvbXBvbmVudFdpbGxNb3VudCgpIHtcblx0XHRjb25zdCB0aGF0ID0gdGhpcztcblxuXHRcdGlwYy5vbignaXRlbS1hbGwnLCBmdW5jdGlvbihlcnIsIGl0ZW1zKSB7XG5cdFx0XHR0aGF0LnNldFN0YXRlKHsgaXRlbXM6IGl0ZW1zIH0pO1xuXHRcdH0pO1xuXG5cdFx0aXBjLm9uKCdjYXRlZ29yeS1hbGwnLCBmdW5jdGlvbihlcnIsIGNhdGVnb3JpZXMpIHtcblx0XHRcdHRoYXQuc2V0U3RhdGUoeyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH0pO1xuXHRcdH0pO1xuXG5cdFx0aXBjLm9uKCdzdG9jay1hbGwnLCBmdW5jdGlvbihlcnIsIHN0b2Nrcykge1xuXHRcdFx0dGhhdC5zZXRTdGF0ZSh7IHN0b2Nrczogc3RvY2tzIH0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy51cGRhdGVEYXRhKCk7XG5cdH1cblxuXHR1cGRhdGVEYXRhKCkge1xuXHRcdGlwYy5zZW5kKCdkYXRhLXJlcXVlc3QnLCB7XG5cdFx0XHRkYk5hbWU6ICdJdGVtJyxcblx0XHRcdGFsbDogdHJ1ZSxcblx0XHRcdHRhcmdldFdpbmRvdzogJ2V4cG9ydFdpbmRvdycsXG5cdFx0XHR0YXJnZXRFdmVudDogJ2l0ZW0tYWxsJ1x0XHRcdFxuXHRcdH0pO1xuXHRcdGlwYy5zZW5kKCdkYXRhLXJlcXVlc3QnLCB7XG5cdFx0XHRkYk5hbWU6ICdDYXRlZ29yeScsXG5cdFx0XHRhbGw6IHRydWUsXG5cdFx0XHR0YXJnZXRXaW5kb3c6ICdleHBvcnRXaW5kb3cnLFxuXHRcdFx0dGFyZ2V0RXZlbnQ6ICdjYXRlZ29yeS1hbGwnXHRcdFx0XG5cdFx0fSk7XG5cdFx0aXBjLnNlbmQoJ2RhdGEtcmVxdWVzdCcsIHtcblx0XHRcdGRiTmFtZTogJ1N0b2NrJyxcblx0XHRcdGFsbDogdHJ1ZSxcblx0XHRcdHRhcmdldFdpbmRvdzogJ2V4cG9ydFdpbmRvdycsXG5cdFx0XHR0YXJnZXRFdmVudDogJ3N0b2NrLWFsbCdcdFx0XHRcblx0XHR9KTtcblx0fVxuXG5cdGV4cG9ydCgpIHtcblx0XHRsZXQgcmV0ID0gJyc7XG5cdFx0dGhpcy5zdGF0ZS5jYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xuXHRcdFx0cmV0ICs9ICc+ICAnICsgY2F0ZWdvcnkubmFtZSArICdcXG4nO1xuXG5cdFx0XHQvLyBnZXQgYWxsIGl0ZW1zIGZvciB0aGlzIGNhdGVnb3J5XG5cdFx0XHRjb25zdCBpdGVtcyA9IHRoaXMuc3RhdGUuaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xuXHRcdFx0XHRpZiAoaXRlbS5jYXRlZ29yeUlkID09PSBjYXRlZ29yeS5pZCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuXHRcdFx0XHQvLyBzZWUgaWYgdGhlcmUncyBzdG9ja1xuXHRcdFx0XHRjb25zdCBzdG9jayA9IHRoaXMuc3RhdGUuc3RvY2tzLmZpbHRlcihzdG9jayA9PiB7XG5cdFx0XHRcdFx0aWYgKHN0b2NrLml0ZW1JZCA9PT0gaXRlbS5pZCAmJiBzdG9jay5hdmFpbGFibGUpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRsZXQgcHJpY2UgPSAnc29sZCBvdXQnO1xuXHRcdFx0XHRpZiAoc3RvY2subGVuZ3RoKSBwcmljZSA9IGl0ZW0uZGVmYXVsdFByaWNlO1xuXG5cdFx0XHRcdHJldCArPSAnKiAnICsgaXRlbS5uYW1lICsgJyAgICBfJyArIHByaWNlICsgJ18gXFxuJztcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXQgKz0gJ1xcblxcbic7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiAoXG5cdFx0ICA8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbC14cy0xMic+XG5cblx0XHRcdCAgXHQ8dGV4dGFyZWEgaWQ9J2V4cG9ydC10ZXh0JyByZWFkT25seSB2YWx1ZT17dGhpcy5leHBvcnQoKX0+XG5cdFx0XHQgIFx0PC90ZXh0YXJlYT5cblxuXHRcdFx0XHQ8L2Rpdj5cblx0XHQgIDwvZGl2PlxuXHRcdCk7XG5cdH1cbn1cblxuUmVhY3QucmVuZGVyKDxFeHBvcnQgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSk7Il19

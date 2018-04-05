"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class to represent Middleware Manager
 * @author Gauthier de Girodon Pralong
 */

var MiddleWareManager = function () {
	function MiddleWareManager() {
		(0, _classCallCheck3.default)(this, MiddleWareManager);

		this.middlewareList = [];
	}

	/**
  * Middleware Generator
  * @param {Array} arr the middleware array
  * */


	(0, _createClass3.default)(MiddleWareManager, [{
		key: "middlewareGen",
		value: /*#__PURE__*/_regenerator2.default.mark(function middlewareGen(arr) {
			var i;
			return _regenerator2.default.wrap(function middlewareGen$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							i = 0;

						case 1:
							if (!(i < arr.length)) {
								_context.next = 7;
								break;
							}

							_context.next = 4;
							return arr[i];

						case 4:
							i++;
							_context.next = 1;
							break;

						case 7:
						case "end":
							return _context.stop();
					}
				}
			}, middlewareGen, this);
		})

		/**
   * Add Middleware to list. Can be chain
   * @param {Object} middleware middleware function
   */

	}, {
		key: "use",
		value: function use(middleware) {
			this.middlewareList.push(middleware);
			return this;
		}

		/**
   * iterate the middleware list
   * @param iterator {Object} the current middleware
   * @param evt {Object} event called by client
   * @param socket {Object} the socket client
   * @param data {Object} a array list of params 
   * @param finish {Object} inital method to call
   */

	}, {
		key: "iterateMiddleWare",
		value: function iterateMiddleWare(iterator, evt, socket, data, finish) {
			var _this = this;

			var it = iterator.next();
			if (!it.done) {
				var next = function next() {
					return _this.iterateMiddleWare.call(_this, iterator, evt, socket, data, finish);
				};
				it.value.call(it.value, evt, socket, data, next);
			} else {
				finish();
			}
		}

		/**
   * executeMiddleware
   * @param evt {Object} event called by client
   * @param socket {Object} the socket client
   * @param data {Object} a array list of params 
   * @param finish {Object} inital method to call
   */

	}, {
		key: "executeMiddleware",
		value: function executeMiddleware(evt, socket, data, finish) {
			var gen = this.middlewareGen(this.middlewareList);
			this.iterateMiddleWare(gen, evt, socket, data, finish);
		}
	}]);
	return MiddleWareManager;
}();

;
exports.default = MiddleWareManager;
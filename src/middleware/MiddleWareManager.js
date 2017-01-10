/**
 * Class to represent Middleware Manager
 * @author Gauthier de Girodon Pralong
 */

class MiddleWareManager {
	constructor() {
		this.middlewareList = []
	}

	/**
	 * Middleware Generator
	 * @param {Array} arr the middleware array
	 * */
	* middlewareGen(arr) {
		var i = 0;
		while (i < arr.length) {
			yield arr[i];
			i++;
		}
	}

	/**
	 * Add Middleware to list. Can be chain
	 * @param {Object} middleware middleware function
	 */
	use(middleware) {
		this.middlewareList.push(middleware)
		return this
	}

	/**
	 * iterate the middleware list
	 * @param iterator {Object} the current middleware
	 * @param evt {Object} event called by client
	 * @param socket {Object} the socket client
	 * @param data {Object} a array list of params 
	 * @param finish {Object} inital method to call
	 */
	iterateMiddleWare(iterator, evt, socket, data, finish) {
		let it = iterator.next();
		if (!it.done) {
			let next = () => this.iterateMiddleWare.call(this, iterator, evt, socket, data, finish)
			it.value.call(it.value, evt, socket, data, next)
		} else {
			finish()
		}
	}

	/**
	 * executeMiddleware
	 * @param evt {Object} event called by client
	 * @param socket {Object} the socket client
	 * @param data {Object} a array list of params 
	 * @param finish {Object} inital method to call
	 */
	executeMiddleware(evt, socket, data, finish) {
		let gen = this.middlewareGen(this.middlewareList);
		this.iterateMiddleWare(gen, evt, socket, data, finish);
	}

};
export default MiddleWareManager
class MiddleWareManager {
	constructor() {
		this.middlewareList = []
	}

/**
 *Middleware Generator
 * */
	*	middlewareGen(arr) {
		var i = 0;
		while (i < arr.length) {
			yield arr[i];
			i++;
		}
	}

/**
 * Add Middleware to list. Can be chain
 */
	use(middleware) {
		this.middlewareList.push(middleware)
	}

/**
 * iterate the middleware list
 */
	iterateMiddleWare(iterator,  evt, socket, data, finish) {
		let it = iterator.next();
		if (!it.done) {
			let next = () => this.iterateMiddleWare.call(this, iterator, evt, socket, data, finish)
			it.value.call(it.value, evt, socket, data, next)
		}else{
			finish()
		}
	}

/**
 * executeMiddleware
 */
	executeMiddleware(evt, socket, data, finish) {
		let gen = this.middlewareGen(this.middlewareList);
		this.iterateMiddleWare(gen, evt, socket, data, finish);
	}

};
export default MiddleWareManager

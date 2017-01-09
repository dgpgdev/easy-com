/**
 * Class to represent room
 * @author Gauthier de Girodon Pralong
 */

class Room {

	/**
	 * Constructor
	 * @param {string} id - The id value
	 * @param {boolean} keepAlive - flag to keep alive room when no user inside
	 */
	constructor(id = '', keepAlive = false) {
		this.id = id;
		this.keepAlive = keepAlive;
		this._clientList = [];
	}

	/**
	 * Add socket to room
	 * @param {Websocket} socket - the websocket object
	 */
	join(socket) {
		this._clientList.push(socket);
	}

	/**
	 * Remove socket from room
	 * @param {Websocket} socket - the websocket object
	 */
	leave(socket) {
		this._clientList = this._clientList.filter((u) => {
			return u.uuid != socket.uuid
		});
	}

	/**
	 * invoke method to all sockets in room
	 * @param {string} evt - event label
	 * @param {Array} args - arguments array
	 */
	invoke(evt, ...args) {
		this._clientList.forEach((socket) => {
			socket.invoke.apply(this, [evt].concat(args))
		});
	}

	/**
	 * Get clients list
	 * @return {Array} the clients list
	 */
	get clients() {
		return this._clientList;
	}
}

export default Room
import Emitter from 'events'
import WS from 'ws'
import uuid from 'uuid'
import RoomManager from './rooms/RoomManager'
import MiddleWareManager from './middleware/MiddleWareManager'
/**
 * Class represent ws decorator
 * @author Gauthier de Girodon Pralong
 */
class Server extends Emitter.EventEmitter {
	/**
	 * Constructor
	 * @type {Object} opts - the option object
	 */
	constructor(opts = {}) {
		super()
		this.opts = opts;
		Emitter.EventEmitter.call(this)
		this._roomManager = new RoomManager();
		this.middlewareManager = new MiddleWareManager();
	}


	use(middleware) {
		this.middlewareManager.use(middleware);
		return this;
	}
	/**
	 * Initialize events
	 */
	initListeners() {
		this.ws.on('connection', (socket) => {
			//generate a uniq user id
			socket.uuid = uuid.v1();

			//define rooms property for socket
			socket.rooms = [];

			//add socket to room
			socket.join = (roomID) => {
				this._roomManager.join(roomID, socket)
			}

			//remove socket from room
			socket.leave = (roomID) => {
				this._roomManager.leave(roomID, socket)
			}

			//leave client from all rooms
			socket.leaveAll = () => {
				socket.rooms.forEach((roomID) => {
					socket.leave(roomID)
				})
			}

			//get room object
			socket.room = (roomID) => {
				return this._roomManager.getRoom(roomID);
			}

			//invoke method on client socket
			socket.invoke = (...args) => {
				socket.send(JSON.stringify(args))
			}

			//get socket by uuid
			socket.to = (socketID) => {
				return this.ws.clients.filter((client) => client.uuid === socketID)[0];
			}

			//invoke method to all connected socket
			socket.broadcast = (evt, ...args) => {
				this.ws.clients.forEach((socket) => socket.invoke.apply(this, [evt].concat(args)));
			}

			//dispatch event
			socket.on('message', (data) => {
				let d = JSON.parse(data);
				d.splice(1, 0, socket);
				this.middlewareManager.executeMiddleware(d[0], d[1], d.slice(2), () => this.emit.apply(this, d));
			})

			//dispatch disconnect event
			socket.on('close', (code, message) => {
				this.emit('disconnect', socket, code, message);
			})

			//create listeners
			this.createListeners(socket, ['error', 'ping', 'pong', 'open'])

			//dispatch connection event
			this.emit('connection', socket)
		})

		this.createListeners(this.ws, ['error', 'headers'])
	}

	/**
	 * map event from emitter to server
	 */
	createListeners(target, evtList) {
		evtList.forEach((value) => {
			target.on(value, (data) => {
				this.emit(value, data);
			})
		})
	}

	/**
	 * Start the server
	 * emit a status event
	 */
	start() {
		this.ws = new WS.Server(this.opts);
		this.initListeners();
		this.emit('status', {
			statudID: 0,
			message: 'Server is ready'
		})
	}

	/**
	 * stop the server
	 * emit a status event
	 */
	stop() {
		this.ws.close((err) => this.emit('status', {
			statudID: 1,
			message: 'Server stopped',
			error: err
		}))
	}

	/**
	 * Get all clients connected to server
	 * @return {Array} array list of socket
	 */
	get clients() {
		return this.ws.clients;
	}

	/**
	 * Get all rooms
	 * @return {Array} room list
	 */
	get rooms() {
		return this._roomManager.rooms;
	}

	/**
	 * Get the room manager
	 * @method roomManager
	 * @return {RoomManager}    the room manager
	 */
	get roomManager() {
		return this._roomManager;
	}


}
export default Server

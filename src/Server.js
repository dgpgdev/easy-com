import Emitter from 'events'
import WS from 'ws'
import uuid from 'uuid'
import RoomManager from './rooms/RoomManager'
/**
 *
 */
class Server extends Emitter.EventEmitter {
    /**
     * [opts description]
     * @type {Object}
     */
    constructor(opts = {}) {
        super()
        this.opts = opts;
        Emitter.EventEmitter.call(this)
        this.plugins = [];
        this.roomManager = new RoomManager();
        console.log('test');
    }

    /**
     * Initialize events
     */
    initListeners() {
        this.ws.on('connection', (socket) => {
            //generate a uniq user id
            socket.uuid = uuid.v1();
            //add socket to room
            socket.join = (roomID) => {
                    this.roomManager.join(roomID, socket)
                }
                //remove socket from room
            socket.leave = (roomID) => {
                    this.roomManager.leave(roomID, socket)
                }
                //get room object
            socket.room = (roomID) => {
                    return this.roomManager.getRoom(roomID);
                }
                //invoke method on client socket
            socket.invoke = (evt, ...args) => {
                    socket.send(JSON.stringify({
                        evt,
                        data: args
                    }))
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
                    this.emit.apply(this, [d.evt, socket].concat(d.data))
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
     * [rooms description]
     * @return {[type]} [description]
     */
    get rooms() {
        return this.roomManager.rooms;
    }

}
export default Server

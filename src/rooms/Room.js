/**
 *
 */
class Room {
  
    /**
     * [id description]
     * @type {String}
     */
    constructor(id = '') {
        this.id = id;
        this._clientList = [];
    }

    /**
     *
     */
    join(socket) {
        this._clientList.push(socket);
    }

    /**
     *
     */
    leave(socket) {
        this._clientList = this._clientList.filter((u) => {
            return u.uuid != socket.uuid
        });
    }

    /**
     * invoke method to all sockets in room
     */
    invoke(evt, data) {
        this._clientList.forEach((socket) => {
            socket.invoke(evt, data)
        });
    }

    /**
     * [clients description]
     * @return {[type]} [description]
     */
    get clients() {
        return this._clientList;
    }
}

export default Room

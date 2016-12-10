import Room from './Room'
class RoomManager {
    /**
     *
     */
    constructor() {
        this.roomList = [];
    }

    /**
     *
     */
    get rooms() {
        return this.roomList;
    }

    /**
     *
     */
    getRoom(roomID) {
        return this.roomList.filter((room) => room.id === roomID)[0];
    }

    /**
     *
     */
    join(roomID, socket) {
        let r = this.getRoom(roomID)

        if (r === undefined) {
            r = new Room(roomID)
            this.roomList.push(r);
        }
        r.join(socket);
    }

    /**
     *
     */
    leave(roomID, socket) {
        let r = this.getRoom(roomID);
        r.leave(socket);
    }


}
export default RoomManager

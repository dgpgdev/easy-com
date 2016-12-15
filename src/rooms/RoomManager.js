import Room from './Room'

/**
 * Class to manage rooms list
 * @author Gauthier de Girodon Pralong
 */
class RoomManager {

    /**
     * Constructor
     */
    constructor() {
        this.roomList = [];
    }

    /**
     * Get all rooms
     * @return {array} The room list
     */
    get rooms() {
        return this.roomList;
    }

    /**
     * Get room by roomID
     * @param {string} roomdID - the room id
     * @return {Room} the room object
     */
    getRoom(roomID) {
        return this.roomList.filter((room) => room.id === roomID)[0];
    }

    create(roomID, keepAlive){
      let r = this.getRoom(roomID)
      if (r === undefined) {
          r = new Room(roomID, keepAlive)
          this.roomList.push(r);
      }

      return r;

    }
    /**
     * Add socket to room
     * @param {string} roomdID - the room id
     * @param {Websocket} socket - the websocket object
     */
    join(roomID, socket) {
        let r = this.create(roomID);
        socket.rooms.push(roomID);
        r.join(socket);
    }


    /**
     * Remove socket from room
     * @param {string} roomdID - the room id
     * @param {Websocket} socket - the websocket object
     */
    leave(roomID, socket) {
        let r = this.getRoom(roomID);
        r.leave(socket);
        if(r.clients.length === 0 && !r.keepAlive){
          this.roomList = this.roomList.filter((room) => room.id != roomID);
        };
    }

}
export default RoomManager

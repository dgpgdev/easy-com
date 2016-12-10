import RoomManager from '../src/rooms/RoomManager'
import Room from '../src/rooms/Room'
import uuid from 'uuid'

const assert = require('chai').assert;

describe('Room Manager test', function() {

    describe('Temp Room Test', function() {
        const rm = new RoomManager();
        const room = rm.create('room1');
        const user = {
            uuid: uuid.v1()
        }
        it('create a temp room', function() {

            assert.isDefined(room, 'room is defined object')
            assert.instanceOf(room, Room, 'room is an instance of Room')
            assert.isFalse(room.keepAlive, 'room is not alive room')
            assert.lengthOf(room.clients, 0, 'clients list empty')
        })

        it('add a user to room', function() {
            rm.join('room1', user);
            assert.lengthOf(room.clients, 1, 'client added to client list')
        })

        it('remove a user to room', function() {
            rm.leave('room1', user);
            assert.lengthOf(room.clients, 0, 'client list empty')
        })

        it('room is removed if no clients and room is not a keepalive room', function() {
            assert.lengthOf(rm.rooms, 0, 'room list is empty')

        })
    })

    describe('Keep Alive Room Test', function() {
        const rm = new RoomManager();
        const roomk = rm.create('room2', true);
        const user = {
            uuid: uuid.v1()
        }

        it('create a keepalive room', function() {
            assert.isDefined(roomk, 'room is defined object')
            assert.instanceOf(roomk, Room, 'room is an instance of Room')
            assert.isTrue(roomk.keepAlive, 'room is a keepAlive room')
            assert.lengthOf(roomk.clients, 0, 'clients list empty')
        })

        it('add a user to keekAlive room', function() {
            rm.join('room2', user);
            assert.lengthOf(roomk.clients, 1, 'client added to client list')
        })

        it('remove a user to room', function() {
            rm.leave('room2', user);
            assert.lengthOf(roomk.clients, 0, 'client list empty')
        })

        it('room is not removed if no clients and room is a keepalive room', function() {
            assert.lengthOf(rm.rooms, 1, 'room list is not empty')
            assert.instanceOf(rm.getRoom('room2'), Room, 'getRoom return an instance of Room');
            assert.strictEqual(rm.getRoom('room2').keepAlive, true, 'room2 is a keepAlive room');
        })
    })

})

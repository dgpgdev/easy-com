import RoomManager from '../src/rooms/RoomManager'
import Room from '../src/rooms/Room'
import uuid from 'uuid'

describe('[TEST] Room Manager', function() {
    describe('Temporary room', function() {
        const rm = new RoomManager();
        const room = rm.create('room1');
        const user = {
            uuid: uuid.v1(),
            rooms: []
        }
        it('create a temp room', ()=> {
            expect(room).toBeDefined()
            expect(room).toBeInstanceOf(Room)
            expect(room.keepAlive).toBe(false)
            expect(room.clients).toHaveLength(0)
        })

        it('add a user to room', ()=> {
            rm.join('room1', user);
            console.log(room.clients)
            expect(room.clients).toHaveLength(1)
        })

        it('remove a user to room', ()=> {
            rm.leave('room1', user);
            expect(room.clients).toHaveLength(0)
        })

        it('room is removed if no clients and room is not a keepalive room', ()=> {
            expect(rm.rooms).toHaveLength(0)
        })
    })

    describe('Keep Alive Room', function() {
        const rm = new RoomManager();
        const roomk = rm.create('room2', true);
        const user = {
            uuid: uuid.v1(),
            rooms: []
        }
        it('create a keepalive room', function() {
            expect(roomk).toBeDefined()
            expect(roomk).toBeInstanceOf(Room)
            expect(roomk.keepAlive).toBe(true)
            expect(roomk.clients).toHaveLength(0)
        })
        it('add a user to keekAlive room', function() {
            rm.join('room2', user);
            expect(roomk.clients).toHaveLength(1)
        })

        it('remove a user to room', function() {
            rm.leave('room2', user);
            expect(roomk.clients).toHaveLength(0)
        })

        it('room is not removed if no clients and room is a keepalive room', function() {
            expect(rm.rooms).toHaveLength(1)
            expect(rm.getRoom('room2')).toBeInstanceOf(Room);
            expect(rm.getRoom('room2').keepAlive).toBe(true);
        })
    })

})

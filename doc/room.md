## Room System
Easy-Com is build with a simple room system. You can use the room manager or socket to interact with room.

#### server.roomManager
Get the room manager instance. You can manipulate room.
```javascript
server.roomManager;
```
#### roomManager.create(roomID, keepAlive = false)
By default all room are temporary. If no clients are inside when a leave method is called the room manager remove it.
*this example create a room identified by 'myroom' and permanently*
```javascript
server.roomManager.create('myroom', true);
```



## Code Example
```javascript
const easycom = require('easy-com');
const server = new easycom({host:'localhost', port:8080});

server.on('status', (info)=> console.log(info.message));

server.on('connection', (socket)=> {
  console.log('socket #%s connected', socket.uuid)
});

//add socket to room
server.on("join", (socket, roomID) => {
    socket.join(roomID);
})

//leave socket from room
server.on("leave", (socket, roomID) => {
    socket.leave(roomID);
})

server.on('disconnect', (socket, code, message) => {
  console.log('socket #%s disconnected', socket.uuid)
});

server.start();
```

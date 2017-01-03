## Socket
All socket are identified by a uniq id. if you want to know a socket uniq id, you can use uuid property.

#### socket.uuid
Get the uniq id for this socket.
```javascript
socket.uuid;
```

#### socket.join(roomID)
Add a socket to room. roomID is a string and the room identifier. If room doesn't exist the room manager create it.
```javascript
socket.join('myroom');
```

#### socket.leave(roomID)
remove a socket from room. roomID is a string and the room identifier.
```javascript
socket.leave('myroom');
```

#### socket.leaveAll()
remove a socket from all room.
```javascript
socket.leaveAll();
```

#### socket.room(roomID)
get room object identified by roomID.
```javascript
socket.room('myroom');
```
if you want to send message to all clients in a room, you can call invoke method from room object.

```javascript
socket.room('myroom').invoke('myfunc', 'hello');
```

#### socket.rooms
return a array who contains all roomID where socket is connected
```javascript
socket.rooms; // example : ['vuejs', 'javascript pattern']
```

#### socket.to(socketID)
get socket object identified by socketID.
```javascript
socket.to(socketID);
```
if you want to send message to client, you can call invoke method from socket object.

```javascript
socket.to(socketID).invoke('myfunc', 'hello');
```


## Simple Chat Server Example
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

//send Data to room
server.on("sendToRoom", (socket, roomID, data) => {
    socket.room(roomID).invoke('onRoomData', data);
})

//send private message to room
server.on("pivateMessage", (socket, socketID, data) => {
    socket.to(socketID).invoke('onPrivateData', data);
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

const easycom  =  require('../../index')

const server = new easycom({
    host: 'localhost',
    port: 8080
});

server.on('status', (info) => console.log(info.message));

server.on('connection', (socket) => {
    console.log('socket # %s connected', socket.uuid)
		console.log(socket.rooms);

    socket.invoke('myID', socket.uuid)
});

server.on('disconnect', (socket, code, message) => {
    console.log('socket #%s is disconnected', socket.uuid)
    socket.leaveAll();
    server.rooms.forEach((r)=>{
      console.log(r.id,' clients :', r.clients.length);
    })
});

server.on("join", (socket, roomID) => {
    socket.join(roomID);
  //  socket.invoke('myID', socket.uuid)
    console.log('%s clients in %s', socket.room(roomID).clients.length, roomID);
    server.rooms.forEach((r)=>{
      console.log(r.id,' clients :', r.clients.length);
    })
    //  socket.room(roomID).invoke('joinRoom', "hello room "+roomID)
})

server.on("leave", (socket, roomID) => {
    socket.leave(roomID);

    //console.log('%s clients in %s', socket.room(roomID).clients.length, roomID);
    //  socket.room(roomID).invoke('joinRoom', "hello room "+roomID)
})

server.on("sendToRoom", (socket, roomID, m, v) => {
    socket.room(roomID).invoke('onSondRoom', m,v)

    //console.log('%s clients in %s', socket.room(roomID).clients.length, roomID);
    //  socket.room(roomID).invoke('joinRoom', "hello room "+roomID)
})

server.on("privateMsg", (socket, socketID, message) => {
    socket.to(socketID).invoke('privateMSG', message)
})


server.on("broadcast", (socket, message) => {
    socket.broadcast('broadcastCall', message);
})


const Authorize = (evt, socket, data, next) =>{
	console.log('middleware authorize detected');
	//console.log(socket.uuid);
	next()
}

const UPPERCASE = (evt, socket, data, next) =>{
	console.log('middleware uppercase detected');
	socket.invoke('fuck', data)
	next()
//console.log(socket)
}

server.use(Authorize).use(UPPERCASE)
server.start();



/*
const RTCServer = require('../../index');

const server = new RTCServer({host:'localhost', port:8080});
server.on('status', (info)=> console.log(info.message));
server.on('connection', (socket)=> {

  //s.join('maroom');

//  s.room('maroom').clients;
  //s.room('maroom').clients;
});

server.on('message', (info)=> console.log(info));
server.on('close', (info)=> console.log(info));


server.on('join', (socket, data) => {

});

server.on('sendRoom', (socket, param1, param2)=>{
  console.log(param1);
  //socket.room('maroom').invoke('message', param1, param2)
})
server.on('leave', (info)=> console.log(info));


server.start();*/

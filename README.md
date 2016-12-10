## What is Easy-Com ?
Easy-Com is a decorator of powerfull ws package ([ws github][983cff2d])

  [983cff2d]: https://github.com/websockets/ws "ws github"

 More easy to use and a room system is available natively.


 ## Installation

 ```
 npm install --save easy-com
 ```

## Code Example
Basic server

```javascript

const easycom = require('easy-com');
const server = new easycom({host:'localhost', port:8080});

server.on('status', (info)=> console.log(info.message));

server.on('connection', (socket)=> {
  console.log('socket # %s connected', socket.uuid)
});

server.on('disconnect', (socket, code, message) => {
  console.log('socket #%s disconnected', socket.uuid)
});

server.start();

```

## Api Reference

Room

## MIT License

Copyright (c) 2016 Gauthier de Girodon Pralong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

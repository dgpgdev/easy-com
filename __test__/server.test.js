import EasyCom from '../lib/Server'


afterAll(()=> server.stop())

describe('[TEST] server', ()=> {
  const server = new EasyCom({host:'localhost', port:5588})
  it('object status mus contain host and port when start called', done => {
      server.on('status', statusObject=> {
        expect(statusObject.port).toBe(5588)
        done()
      })
      server.start()
  })
})
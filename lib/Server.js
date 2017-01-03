'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _RoomManager = require('./rooms/RoomManager');

var _RoomManager2 = _interopRequireDefault(_RoomManager);

var _MiddleWareManager = require('./middleware/MiddleWareManager');

var _MiddleWareManager2 = _interopRequireDefault(_MiddleWareManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class represent ws decorator
 * @author Gauthier de Girodon Pralong
 */
var Server = function (_Emitter$EventEmitter) {
    (0, _inherits3.default)(Server, _Emitter$EventEmitter);

    /**
     * Constructor
     * @type {Object} opts - the option object
     */
    function Server() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Server);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this));

        _this.opts = opts;
        _events2.default.EventEmitter.call(_this);
        _this._roomManager = new _RoomManager2.default();
        _this.middlewareManager = new _MiddleWareManager2.default();
        return _this;
    }

    (0, _createClass3.default)(Server, [{
        key: 'use',
        value: function use(middleware) {
            this.middlewareManager.use(middleware);
            return this;
        }
        /**
         * Initialize events
         */

    }, {
        key: 'initListeners',
        value: function initListeners() {
            var _this2 = this;

            this.ws.on('connection', function (socket) {
                //generate a uniq user id
                socket.uuid = _uuid2.default.v1();

                //define rooms property for socket
                socket.rooms = [];

                //add socket to room
                socket.join = function (roomID) {
                    _this2._roomManager.join(roomID, socket);
                };

                //remove socket from room
                socket.leave = function (roomID) {
                    _this2._roomManager.leave(roomID, socket);
                };

                //leave client from all rooms
                socket.leaveAll = function () {
                    socket.rooms.forEach(function (roomID) {
                        socket.leave(roomID);
                    });
                };

                //get room object
                socket.room = function (roomID) {
                    return _this2._roomManager.getRoom(roomID);
                };

                //invoke method on client socket
                socket.invoke = function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    socket.send(JSON.stringify(args));
                };

                //get socket by uuid
                socket.to = function (socketID) {
                    return _this2.ws.clients.filter(function (client) {
                        return client.uuid === socketID;
                    })[0];
                };

                //invoke method to all connected socket
                socket.broadcast = function (evt) {
                    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                        args[_key2 - 1] = arguments[_key2];
                    }

                    _this2.ws.clients.forEach(function (socket) {
                        return socket.invoke.apply(_this2, [evt].concat(args));
                    });
                };

                //dispatch event
                socket.on('message', function (data) {
                    var d = JSON.parse(data);
                    d.splice(1, 0, socket);
                    _this2.middlewareManager.executeMiddleware(d[0], d[1], d.slice(2));
                    _this2.emit.apply(_this2, d);
                });

                //dispatch disconnect event
                socket.on('close', function (code, message) {
                    _this2.emit('disconnect', socket, code, message);
                });

                //create listeners
                _this2.createListeners(socket, ['error', 'ping', 'pong', 'open']);

                //dispatch connection event
                _this2.emit('connection', socket);
            });

            this.createListeners(this.ws, ['error', 'headers']);
        }

        /**
         * map event from emitter to server
         */

    }, {
        key: 'createListeners',
        value: function createListeners(target, evtList) {
            var _this3 = this;

            evtList.forEach(function (value) {
                target.on(value, function (data) {
                    _this3.emit(value, data);
                });
            });
        }

        /**
         * Start the server
         * emit a status event
         */

    }, {
        key: 'start',
        value: function start() {
            this.ws = new _ws2.default.Server(this.opts);
            this.initListeners();
            this.emit('status', {
                statudID: 0,
                message: 'Server is ready'
            });
        }

        /**
         * stop the server
         * emit a status event
         */

    }, {
        key: 'stop',
        value: function stop() {
            var _this4 = this;

            this.ws.close(function (err) {
                return _this4.emit('status', {
                    statudID: 1,
                    message: 'Server stopped',
                    error: err
                });
            });
        }

        /**
         * Get all clients connected to server
         * @return {Array} array list of socket
         */

    }, {
        key: 'clients',
        get: function get() {
            return this.ws.clients;
        }

        /**
         * Get all rooms
         * @return {Array} room list
         */

    }, {
        key: 'rooms',
        get: function get() {
            return this._roomManager.rooms;
        }

        /**
         * Get the room manager
         * @method roomManager
         * @return {RoomManager}    the room manager
         */

    }, {
        key: 'roomManager',
        get: function get() {
            return this._roomManager;
        }
    }]);
    return Server;
}(_events2.default.EventEmitter);

exports.default = Server;
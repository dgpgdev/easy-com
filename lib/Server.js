'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _RoomManager = require('./rooms/RoomManager');

var _RoomManager2 = _interopRequireDefault(_RoomManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class represent ws decorator
 * @author Gauthier de Girodon Pralong
 */
var Server = function (_Emitter$EventEmitter) {
    _inherits(Server, _Emitter$EventEmitter);

    /**
     * Constructor
     * @type {Object} opts - the option object
     */
    function Server() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Server);

        var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this));

        _this.opts = opts;
        _events2.default.EventEmitter.call(_this);
        _this._roomManager = new _RoomManager2.default();
        return _this;
    }

    /**
     * Initialize events
     */


    _createClass(Server, [{
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
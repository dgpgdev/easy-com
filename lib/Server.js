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
 *
 */
var Server = function (_Emitter$EventEmitter) {
    _inherits(Server, _Emitter$EventEmitter);

    /**
     * [opts description]
     * @type {Object}
     */
    function Server() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Server);

        var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this));

        _this.opts = opts;
        _events2.default.EventEmitter.call(_this);
        _this.plugins = [];
        _this.roomManager = new _RoomManager2.default();
        console.log('test');
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
                socket.uuid = _uuid2.default.v1();
                //
                socket.join = function (roomID) {
                    _this2.roomManager.join(roomID, socket);
                };
                socket.leave = function (roomID) {
                    _this2.roomManager.leave(roomID, socket);
                };
                socket.room = function (roomID) {
                    return _this2.roomManager.getRoom(roomID);
                };

                socket.invoke = function (evt) {
                    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        args[_key - 1] = arguments[_key];
                    }

                    socket.send(JSON.stringify({ evt: evt, data: args }));
                };

                socket.to = function (socketID) {};

                socket.on('message', function (data) {
                    var d = JSON.parse(data);
                    _this2.emit.apply(_this2, [d.evt, socket].concat(d.data));
                });

                socket.on('close', function (code, message) {
                    _this2.emit('disconnect', socket, code, message);
                });

                console.log(_this2.ws.clients);
                _this2.createListeners(socket, ['error', 'ping', 'pong', 'open']);
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

        /*messageDispatcher(evt, socket, data) {
            this.emit(evt, socket, data)
        }*/

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
    }, {
        key: 'rooms',
        get: function get() {
            return this.roomManager.rooms;
        }
    }]);

    return Server;
}(_events2.default.EventEmitter);

exports.default = Server;
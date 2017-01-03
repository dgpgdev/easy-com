'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class to represent room
 * @author Gauthier de Girodon Pralong
 */

var Room = function () {

    /**
     * Constructor
     * @param {string} id - The id value
     * @param {boolean} keepAlive - flag to keep alive room when no user inside
     */
    function Room() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var keepAlive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        (0, _classCallCheck3.default)(this, Room);

        this.id = id;
        this.keepAlive = keepAlive;
        this._clientList = [];
    }

    /**
     * Add socket to room
     * @param {Websocket} socket - the websocket object
     */


    (0, _createClass3.default)(Room, [{
        key: 'join',
        value: function join(socket) {
            this._clientList.push(socket);
        }

        /**
         * Remove socket from room
         * @param {Websocket} socket - the websocket object
         */

    }, {
        key: 'leave',
        value: function leave(socket) {
            this._clientList = this._clientList.filter(function (u) {
                return u.uuid != socket.uuid;
            });
        }

        /**
         * invoke method to all sockets in room
         * @param {string} evt - event label
         * @param {Array} args - arguments array
         */

    }, {
        key: 'invoke',
        value: function invoke(evt) {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            this._clientList.forEach(function (socket) {
                socket.invoke.apply(_this, [evt].concat(args));
            });
        }

        /**
         * Get clients list
         * @return {Array} the clients list
         */

    }, {
        key: 'clients',
        get: function get() {
            return this._clientList;
        }
    }]);
    return Room;
}();

exports.default = Room;
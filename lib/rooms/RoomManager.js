'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Room = require('./Room');

var _Room2 = _interopRequireDefault(_Room);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class to manage rooms list
 * @author Gauthier de Girodon Pralong
 */
var RoomManager = function () {

	/**
  * Constructor
  */
	function RoomManager() {
		(0, _classCallCheck3.default)(this, RoomManager);

		this.roomList = [];
	}

	/**
  * Get all rooms
  * @return {array} The room list
  */


	(0, _createClass3.default)(RoomManager, [{
		key: 'getRoom',


		/**
   * Get room by roomID
   * @param {string} roomdID - the room id
   * @return {Room} the room object
   */
		value: function getRoom(roomID) {
			return this.roomList.filter(function (room) {
				return room.id === roomID;
			})[0];
		}
	}, {
		key: 'create',
		value: function create(roomID, keepAlive) {
			var r = this.getRoom(roomID);
			if (r === undefined) {
				r = new _Room2.default(roomID, keepAlive);
				this.roomList.push(r);
			}
			return r;
		}

		/**
   * Add socket to room
   * @param {string} roomdID - the room id
   * @param {Websocket} socket - the websocket object
   */

	}, {
		key: 'join',
		value: function join(roomID, socket) {
			var r = this.create(roomID);
			socket.rooms.push(roomID);
			r.join(socket);
		}

		/**
   * Remove socket from room
   * @param {string} roomdID - the room id
   * @param {Websocket} socket - the websocket object
   */

	}, {
		key: 'leave',
		value: function leave(roomID, socket) {
			var r = this.getRoom(roomID);
			r.leave(socket);
			if (r.clients.length === 0 && !r.keepAlive) {
				this.roomList = this.roomList.filter(function (room) {
					return room.id != roomID;
				});
			};
		}
	}, {
		key: 'rooms',
		get: function get() {
			return this.roomList;
		}
	}]);
	return RoomManager;
}();

exports.default = RoomManager;
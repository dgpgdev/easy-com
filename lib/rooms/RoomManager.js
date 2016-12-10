'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Room = require('./Room');

var _Room2 = _interopRequireDefault(_Room);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RoomManager = function () {
    /**
     *
     */
    function RoomManager() {
        _classCallCheck(this, RoomManager);

        this.roomList = [];
    }

    /**
     *
     */


    _createClass(RoomManager, [{
        key: 'getRoom',


        /**
         *
         */
        value: function getRoom(roomID) {
            return this.roomList.filter(function (room) {
                return room.id === roomID;
            })[0];
        }

        /**
         *
         */

    }, {
        key: 'join',
        value: function join(roomID, socket) {
            var r = this.getRoom(roomID);

            if (r === undefined) {
                r = new _Room2.default(roomID);
                this.roomList.push(r);
            }
            r.join(socket);
        }

        /**
         *
         */

    }, {
        key: 'leave',
        value: function leave(roomID, socket) {
            var r = this.getRoom(roomID);
            r.leave(socket);
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
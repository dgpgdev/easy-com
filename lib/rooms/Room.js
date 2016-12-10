'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Room = function () {
  function Room() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, Room);

    this.id = id;
    this._clientList = [];
  }

  _createClass(Room, [{
    key: 'join',
    value: function join(socket) {
      this._clientList.push(socket);
    }
  }, {
    key: 'leave',
    value: function leave(socket) {
      this._clientList = this._clientList.filter(function (u) {
        return u.uuid != socket.uuid;
      });
    }
  }, {
    key: 'invoke',
    value: function invoke(evt, data) {
      this._clientList.forEach(function (socket) {
        socket.invoke(evt, data);
      });
    }
  }, {
    key: 'clients',
    get: function get() {
      return this._clientList;
    }
  }]);

  return Room;
}();

exports.default = Room;
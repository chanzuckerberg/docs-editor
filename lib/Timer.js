'use strict';

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Timer = function () {
  function Timer() {
    (0, _classCallCheck3.default)(this, Timer);
    this._aIDs = new _set2.default();
    this._tIDs = new _set2.default();
    this._disposed = false;
  }

  (0, _createClass3.default)(Timer, [{
    key: 'set',
    value: function set(fn, delay) {
      if (this._disposed) {
        return;
      }

      if (!delay || delay <= 16) {
        var ids = this._aIDs;
        var id = window.requestAnimationFrame(function () {
          (0, _nullthrows2.default)(ids).delete((0, _nullthrows2.default)(id));
          ids = null;
          id = null;
          fn();
        });
        ids.add(id);
      } else {
        var _ids = this._tIDs;
        var _id = window.setTimeout(function () {
          (0, _nullthrows2.default)(_ids).delete((0, _nullthrows2.default)(_id));
          _ids = null;
          _id = null;
          fn();
        }, delay);
        _ids.add(_id);
      }
    }

    /**
     * Cancel all scheduled function calls in queue.
     *
     * NOTE: The timer still honor any function calls scheduled after a clear
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._aIDs.forEach(function (id) {
        window.cancelAnimationFrame(id);
      });
      this._tIDs.forEach(function (id) {
        window.clearTimeout(id);
      });
      this._aIDs.clear();
      this._tIDs.clear();
    }

    /**
     * Clear the queue & stop honoring any future requests.
     *
     * This method is convenient to call in `componentWillUnmount` to make
     * sure your timer doesn't trigger any new function call.
     */

  }, {
    key: 'dispose',
    value: function dispose() {
      this._disposed = true;
      this.clear();
    }
  }]);
  return Timer;
}();

module.exports = Timer;
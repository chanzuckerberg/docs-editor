'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _DocsHelpers = require('./DocsHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MIN_WIDTH = 32;

var DocsTableCellResizeHandle = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsTableCellResizeHandle, _React$PureComponent);

  function DocsTableCellResizeHandle() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsTableCellResizeHandle);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsTableCellResizeHandle.__proto__ || (0, _getPrototypeOf2.default)(DocsTableCellResizeHandle)).call.apply(_ref, [this].concat(args))), _this), _this._resizeContext = null, _this._eventsCapture = null, _this._onMouseDown = function (e) {
      if (_this._resizeContext) {
        // Already dragging.
        return;
      }
      var position = _this.props.position;
      var target = e.target;

      var td = (0, _DocsHelpers.lookupElementByAttribute)(target, _DocsDataAttributes2.default.TABLE_CELL);
      if (position === 'left' && td) {
        td = td.previousElementSibling;
      }
      var table = (0, _DocsHelpers.lookupElementByAttribute)(td, _DocsDataAttributes2.default.TABLE);
      var tr = table && table.rows && table.rows[0] || null;
      td = tr && td && tr.cells && tr.cells[td.cellIndex] || null;
      if (!td || !tr || !table) {
        return;
      }
      _this._blockEvent(e);

      var tds = (0, _from2.default)(tr.cells);
      var initialStyles = [];
      var initialRects = tds.map(function (cell) {
        var rect = cell.getBoundingClientRect();
        initialStyles.push(cell.style.cssText);
        return {
          height: rect.height,
          width: rect.width,
          x: rect.x,
          y: rect.y
        };
      });
      var newRects = initialRects;
      var minRect = initialRects[td.cellIndex];
      var maxRect = initialRects[td.cellIndex + 1];
      var minXDelta = minRect ? -Math.max(minRect.width - MIN_WIDTH, 0) : 0;
      var maxXDelta = maxRect ? Math.max(0, maxRect.width - MIN_WIDTH) : 0;

      _this._resizeContext = {
        initialRects: initialRects,
        initialStyles: initialStyles,
        initialX: e.clientX,
        maxXDelta: maxXDelta,
        minXDelta: minXDelta,
        moved: false,
        newRects: newRects,
        table: table,
        td: td,
        tds: tds,
        tr: tr
      };

      _this._eventsCapture && _this._eventsCapture.dispose();
      _this._eventsCapture = (0, _captureDocumentEvents2.default)({
        mousemove: _this._onMouseMove,
        mouseup: _this._onMouseUp
      });
    }, _this._onMouseMove = function (e) {
      _this._blockEvent(e);
      var resizeContext = _this._resizeContext;
      if (!resizeContext) {
        return;
      }
      var initialX = resizeContext.initialX,
          initialRects = resizeContext.initialRects,
          td = resizeContext.td,
          tds = resizeContext.tds,
          minXDelta = resizeContext.minXDelta,
          maxXDelta = resizeContext.maxXDelta;


      var dx = Math.round(e.clientX - initialX);
      dx = Math.min(dx, maxXDelta);
      dx = Math.max(dx, minXDelta);

      var oops = false;
      var currentCell = td;
      var nextCell = tds[td.cellIndex + 1];
      var newRects = initialRects.map(function (rect, ii) {
        var cell = tds[ii];
        if (!cell || !rect) {
          oops = true;
          // DOM changed by others.
          return rect;
        }
        if (cell === currentCell) {
          return (0, _extends3.default)({}, rect, {
            width: rect.width + dx
          });
        }
        if (cell === nextCell) {
          return (0, _extends3.default)({}, rect, {
            width: rect.width - dx
          });
        }
        return rect;
      });

      if (oops) {
        return;
      }

      newRects.forEach(function (rect, ii) {
        if (initialRects[ii] !== rect) {
          tds[ii].style.width = rect.width + 'px';
        }
      });
      resizeContext.moved = true;
      resizeContext.newRects = newRects;
    }, _this._onMouseUp = function (e) {
      _this._blockEvent(e);
      _this._eventsCapture && _this._eventsCapture.dispose();
      _this._eventsCapture = null;

      var resizeContext = _this._resizeContext;
      _this._resizeContext = null;
      if (!resizeContext) {
        return;
      }
      _this._resizeContext = null;
      var newRects = resizeContext.newRects,
          tds = resizeContext.tds,
          initialStyles = resizeContext.initialStyles,
          moved = resizeContext.moved;


      if (!moved) {
        return;
      }

      // Resume styles.
      initialStyles.forEach(function (style, ii) {
        var cell = tds[ii];
        if (cell) {
          cell.style.cssText = style;
        }
      });

      var totalWidth = newRects.reduce(function (sum, rect) {
        return sum += rect.width;
      }, 0);
      var sum = 0;
      var colWidths = newRects.map(function (rect, ii) {
        // round up to 3 digits decimals.
        var percentage = Math.round(rect.width * 1000 / totalWidth) / 1000;
        sum += percentage;
        if (sum > 1) {
          var bleed = 1 - sum;
          percentage -= bleed;
          sum -= bleed;
        }
        return percentage;
      });
      _this.props.onColumnResizeEnd(colWidths);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsTableCellResizeHandle, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._eventsCapture && this._eventsCapture.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      var position = this.props.position;


      var className = (0, _classnames2.default)({
        'docs-table-cell-resize-handle': true,
        'docs-table-cell-resize-handle-left': position === 'left',
        'docs-table-cell-resize-handle-right': position === 'right'
      });

      return _react2.default.createElement('div', {
        className: className,
        'data-docs-tool': 'true',
        onMouseDown: this._onMouseDown
      });
    }
  }, {
    key: '_blockEvent',
    value: function _blockEvent(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }]);
  return DocsTableCellResizeHandle;
}(_react2.default.PureComponent);

module.exports = DocsTableCellResizeHandle;
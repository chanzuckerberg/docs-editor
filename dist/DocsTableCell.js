'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _DocsBaseEditor = require('./DocsBaseEditor');

var _DocsBaseEditor2 = _interopRequireDefault(_DocsBaseEditor);

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _DocsTableCellResizeHandle = require('./DocsTableCellResizeHandle');

var _DocsTableCellResizeHandle2 = _interopRequireDefault(_DocsTableCellResizeHandle);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _convertFromRaw = require('./convertFromRaw');

var _convertFromRaw2 = _interopRequireDefault(_convertFromRaw);

var _convertToRaw = require('./convertToRaw');

var _convertToRaw2 = _interopRequireDefault(_convertToRaw);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _draftJs = require('draft-js');

var _DocsTableModifiers = require('./DocsTableModifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLocalEditorState(props) {
  var rawContentState = props.rawContentState;

  return (0, _convertFromRaw2.default)(rawContentState);
}

var DocsTableCell = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsTableCell, _React$PureComponent);

  function DocsTableCell() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsTableCell);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsTableCell.__proto__ || (0, _getPrototypeOf2.default)(DocsTableCell)).call.apply(_ref, [this].concat(args))), _this), _this._editor = null, _this._editorID = (0, _uniqueID2.default)(), _this._localChangeID = null, _this._timer = new _Timer2.default(), _this.state = {
      localEditorState: getLocalEditorState(_this.props)
    }, _this._onEditorRef = function (ref) {
      _this._editor = ref;
    }, _this._onChange = function (localEditorState) {
      if (!_this.context.docsContext.canEdit) {
        return;
      }
      // Effectively and optimistically commit change locally then sync later.
      _this._localChangeID = (0, _uniqueID2.default)();
      _this.setState({ localEditorState: localEditorState }, _this._notifyChange);
    }, _this._notifyChange = function () {
      if (!_this.context.docsContext.canEdit) {
        return;
      }
      _this._timer.clear();
      _this._timer.set(_this._notifyChangeImmediate, 160);
    }, _this._notifyChangeImmediate = function () {
      _this._timer.clear();
      if (!_this._editor) {
        // Unmounted.
        return;
      }
      var _this$props = _this.props,
          cellIndex = _this$props.cellIndex,
          onChange = _this$props.onChange,
          rowIndex = _this$props.rowIndex;
      var localEditorState = _this.state.localEditorState;

      var rawContentState = (0, _convertToRaw2.default)(localEditorState);
      rawContentState[_DocsTableModifiers.LOCAL_CHANGE_ID] = _this._localChangeID;
      onChange(rowIndex, cellIndex, rawContentState);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsTableCell, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // Sync local editor state.
      var rawContentState = nextProps.rawContentState;

      if (this.props.rawContentState === rawContentState) {
        return;
      }

      if (this._localChangeID && rawContentState && rawContentState[_DocsTableModifiers.LOCAL_CHANGE_ID] === this._localChangeID) {
        return;
      }
      this._timer.clear();
      this.setState({
        localEditorState: getLocalEditorState(nextProps)
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._localChangeID = (0, _uniqueID2.default)();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._timer.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      var _attrs;

      var canEdit = this.context.docsContext.canEdit;
      var _props = this.props,
          colSpan = _props.colSpan,
          rowSpan = _props.rowSpan,
          cellIndex = _props.cellIndex,
          rowIndex = _props.rowIndex,
          highlighted = _props.highlighted,
          resizable = _props.resizable,
          colsCount = _props.colsCount,
          onColumnResizeEnd = _props.onColumnResizeEnd,
          width = _props.width,
          bgStyle = _props.bgStyle,
          paddingSize = _props.paddingSize;

      var editorID = this._editorID;

      // $FlowFixMe: can't assign key `bgStyle`.
      var className = (0, _classnames2.default)((0, _defineProperty3.default)({
        'docs-table-cell': true,
        'docs-table-cell-highlighted': highlighted,
        'docs-table-cell-with-bg-style': !!bgStyle,
        'docs-table-cell-with-padding-large': paddingSize === 'large'
      }, bgStyle, !!bgStyle));

      var leftHandle = canEdit && resizable && cellIndex > 0 ? _react2.default.createElement(_DocsTableCellResizeHandle2.default, {
        key: 'r1',
        onColumnResizeEnd: onColumnResizeEnd,
        position: 'left'
      }) : null;

      var effectiveColspan = colSpan || 1;
      var rightHandle = canEdit && resizable && cellIndex < colsCount - 1 ? _react2.default.createElement(_DocsTableCellResizeHandle2.default, {
        key: 'r2',
        onColumnResizeEnd: onColumnResizeEnd,
        position: 'right'
      }) : null;

      var style = null;
      if (rowIndex === 0 && typeof width === 'number' && !isNaN(width)) {
        style = { width: width * 100 + '%' };
      }

      var attrs = (_attrs = {}, (0, _defineProperty3.default)(_attrs, _DocsDataAttributes2.default.EDITOR_FOR, editorID), (0, _defineProperty3.default)(_attrs, _DocsDataAttributes2.default.ELEMENT, true), (0, _defineProperty3.default)(_attrs, _DocsDataAttributes2.default.TABLE_CELL, true), _attrs);
      return _react2.default.createElement(
        'td',
        (0, _extends3.default)({}, attrs, {
          colSpan: colSpan,
          className: className,
          rowSpan: rowSpan,
          style: style }),
        _react2.default.createElement(_DocsBaseEditor2.default, {
          cellIndex: cellIndex,
          editorState: this.state.localEditorState,
          id: editorID,
          onChange: this._onChange,
          ref: this._onEditorRef,
          rowIndex: rowIndex
        }),
        leftHandle,
        rightHandle
      );
    }
  }]);
  return DocsTableCell;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsTableCell);
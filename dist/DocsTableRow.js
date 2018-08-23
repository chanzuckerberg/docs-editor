'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _DocsTableCell = require('./DocsTableCell');

var _DocsTableCell2 = _interopRequireDefault(_DocsTableCell);

var _DocsTableModifiers = require('./DocsTableModifiers');

var _DocsTableModifiers2 = _interopRequireDefault(_DocsTableModifiers);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _draftJs = require('draft-js');

var _DocsModifiers = require('./DocsModifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsTableEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsTableEntityData || require('prop-types').any;

var DocsTableEntityDataKeys = _DocsTableModifiers2.default.DocsTableEntityDataKeys;

var DocsTableRow = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsTableRow, _React$PureComponent);

  function DocsTableRow() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsTableRow);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsTableRow.__proto__ || (0, _getPrototypeOf2.default)(DocsTableRow)).call.apply(_ref, [this].concat(args))), _this), _this._onCellEditChange = function (rowIndex, colIndex, cellData) {
      var _this$props = _this.props,
          editorState = _this$props.editorState,
          onChange = _this$props.onChange,
          entity = _this$props.entity,
          entityKey = _this$props.entityKey;

      var entityData = entity.getData();
      var newEntityData = (0, _extends3.default)({}, entityData);
      var id = (0, _DocsTableModifiers.getEntityDataID)(rowIndex, colIndex);
      newEntityData[id] = cellData;
      var newEditorState = (0, _DocsModifiers.updateEntityData)(editorState, entityKey, newEntityData);
      onChange(newEditorState);
    }, _this._onColumnResizeEnd = function (colWidths) {
      var _this$props2 = _this.props,
          editorState = _this$props2.editorState,
          onChange = _this$props2.onChange,
          entity = _this$props2.entity,
          entityKey = _this$props2.entityKey;

      var entityData = entity.getData();
      var newEntityData = (0, _extends3.default)({}, entityData, {
        colWidths: colWidths
      });
      var newEditorState = (0, _DocsModifiers.updateEntityData)(editorState, entityKey, newEntityData);
      onChange(newEditorState);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsTableRow, [{
    key: 'render',
    value: function render() {
      var _attrs;

      var canEdit = this.context.docsContext.canEdit;
      var _props = this.props,
          entity = _props.entity,
          rowIndex = _props.rowIndex,
          editorRowIndex = _props.editorRowIndex,
          editorCellIndex = _props.editorCellIndex,
          resizable = _props.resizable;


      var entityData = entity.getData();
      var colsCount = entityData.colsCount,
          colWidths = entityData.colWidths;

      var cells = [];
      var rr = rowIndex;
      var cc = 0;
      while (cc < colsCount) {
        var id = (0, _DocsTableModifiers.getEntityDataID)(rr, cc);
        var rawContentState = entityData[id];
        var highlighted = canEdit && rr === editorRowIndex && cc === editorCellIndex;
        var bgStyle = cc === 0 ? entityData.leftColBgStyle : null;
        var bgColor = null;
        if (entityData.cellBgColors && entityData.cellBgColors[id]) {
          bgColor = entityData.cellBgColors[id];
        }
        cells.push(_react2.default.createElement(_DocsTableCell2.default, {
          bgColor: bgColor,
          bgStyle: bgStyle,
          cellIndex: cc,
          colsCount: colsCount,
          highlighted: highlighted,
          key: id,
          onChange: this._onCellEditChange,
          onColumnResizeEnd: this._onColumnResizeEnd,
          paddingSize: entityData[DocsTableEntityDataKeys.PADDING_SIZE],
          rawContentState: rawContentState,
          resizable: resizable,
          rowIndex: rr,
          width: colWidths && colWidths[cc]
        }));
        cc++;
      }
      var className = (0, _classnames2.default)({
        'docs-table-row': true,
        'docs-table-row-header': rr === 0 && !!entityData[DocsTableEntityDataKeys.TOP_ROW_BG_STYLE]
      });
      var attrs = (_attrs = {}, (0, _defineProperty3.default)(_attrs, _DocsDataAttributes2.default.ELEMENT, true), (0, _defineProperty3.default)(_attrs, _DocsDataAttributes2.default.TABLE_ROW, true), _attrs);
      return _react2.default.createElement(
        'tr',
        (0, _extends3.default)({}, attrs, { className: className }),
        cells
      );
    }
  }]);
  return DocsTableRow;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsTableRow);
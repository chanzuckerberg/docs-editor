'use strict';

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

var _DocsActionTypes = require('./DocsActionTypes');

var _DocsActionTypes2 = _interopRequireDefault(_DocsActionTypes);

var _DocsTableMenu = require('./DocsTableMenu');

var _DocsTableMenu2 = _interopRequireDefault(_DocsTableMenu);

var _DocsTableModifiers = require('./DocsTableModifiers');

var _DocsTableModifiers2 = _interopRequireDefault(_DocsTableModifiers);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _docsWithContext = require('./docsWithContext');

var _docsWithContext2 = _interopRequireDefault(_docsWithContext);

var _reactBootstrap = require('react-bootstrap');

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_BaseEditor = require('./Types').babelPluginFlowReactPropTypes_proptype_BaseEditor || require('prop-types').any;

var TableEntityDataKeys = _DocsTableModifiers2.default.TableEntityDataKeys;


var GRID_OPTIONS = [{
  action: _DocsActionTypes2.default.TABLE_INSERT_COLUMN_BEFORE,
  icon: 'border_left',
  label: 'Add Column Before',
  modifier: _DocsTableModifiers2.default.insertColumnBefore
}, {
  action: _DocsActionTypes2.default.TABLE_INSERT_COLUMN_AFTER,
  icon: 'border_right',
  label: 'Add Column After',
  modifier: _DocsTableModifiers2.default.insertColumnAfter
}, null, {
  action: _DocsActionTypes2.default.TABLE_INSERT_ROW_BEFORE,
  icon: 'border_top',
  label: 'Add Row Before',
  modifier: _DocsTableModifiers2.default.insertRowBefore
}, {
  action: _DocsActionTypes2.default.TABLE_INSERT_ROW_AFTER,
  icon: 'border_bottom',
  label: 'Add Row After',
  modifier: _DocsTableModifiers2.default.insertRowAfter
}, null, {
  action: _DocsActionTypes2.default.TABLE_DELETE_ROW,
  icon: 'border_horizontal',
  label: 'Delete Row',
  modifier: _DocsTableModifiers2.default.deleteRow
}, {
  action: _DocsActionTypes2.default.TABLE_DELETE_COLUMN,
  icon: 'border_vertical',
  label: 'Delete Column',
  modifier: _DocsTableModifiers2.default.deleteColumn
}];

var STYLE_OPTIONS = [{
  action: _DocsActionTypes2.default.TABLE_TOOGLE_HEADER_BACKGROUND,
  activeName: TableEntityDataKeys.TOP_ROW_BG_STYLE,
  label: 'Highlight Header',
  modifier: _DocsTableModifiers2.default.toggleHeaderBackground
}, {
  action: _DocsActionTypes2.default.TABLE_TOOGLE_INDEX_COLUMN_BACKGROUND,
  activeName: TableEntityDataKeys.LEFT_COL_BG_STYLE,
  entityDataName: 'leftColBgStyle',
  label: 'Highlight First Column',
  modifier: _DocsTableModifiers2.default.toggleIndexColumnBackground
}, {
  action: _DocsActionTypes2.default.TABLE_TOOGLE_BORDERS,
  activeName: TableEntityDataKeys.NO_BORDERS,
  label: 'Hide Borders',
  modifier: _DocsTableModifiers2.default.toggleBorders
}, {
  action: _DocsActionTypes2.default.TABLE_TOOGLE_PADDINGS,
  activeName: TableEntityDataKeys.PADDING_SIZE,
  label: 'Larger Paddings',
  modifier: _DocsTableModifiers2.default.togglePaddings
}];

var DocsTableToolbar = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsTableToolbar, _React$PureComponent);

  function DocsTableToolbar() {
    (0, _classCallCheck3.default)(this, DocsTableToolbar);
    return (0, _possibleConstructorReturn3.default)(this, (DocsTableToolbar.__proto__ || (0, _getPrototypeOf2.default)(DocsTableToolbar)).apply(this, arguments));
  }

  (0, _createClass3.default)(DocsTableToolbar, [{
    key: 'render',
    value: function render() {
      if (!this.context.docsContext.canEdit) {
        return null;
      }
      var editor = this.props.getEditor();
      var className = (0, _classnames2.default)({
        'docs-table-toolbar': true,
        'docs-table-toolbar-disabled': !editor
      });
      var editorID = editor ? editor.id : null;
      return _react2.default.createElement(
        'div',
        { className: className, 'data-docs-editor-for': editorID },
        _react2.default.createElement(
          _reactBootstrap.ButtonGroup,
          null,
          _react2.default.createElement(_DocsTableMenu2.default, (0, _extends3.default)({}, this.props, {
            key: 'grid',
            options: GRID_OPTIONS,
            title: 'Grid'
          })),
          ' ',
          _react2.default.createElement(_DocsTableMenu2.default, (0, _extends3.default)({}, this.props, {
            key: 'style',
            options: STYLE_OPTIONS,
            title: 'Styles'
          }))
        )
      );
    }
  }]);
  return DocsTableToolbar;
}(_react2.default.PureComponent);

module.exports = (0, _docsWithContext2.default)(DocsTableToolbar);
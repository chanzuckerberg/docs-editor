'use strict';

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

var _DocsDropdownButton = require('./DocsDropdownButton');

var _DocsDropdownButton2 = _interopRequireDefault(_DocsDropdownButton);

var _DocsMenuItem = require('./DocsMenuItem');

var _DocsMenuItem2 = _interopRequireDefault(_DocsMenuItem);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _DocsModifiers = require('./DocsModifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsEditorLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorLike || require('prop-types').any;

var DocsTableMenu = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsTableMenu, _React$PureComponent);

  function DocsTableMenu() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsTableMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsTableMenu.__proto__ || (0, _getPrototypeOf2.default)(DocsTableMenu)).call.apply(_ref, [this].concat(args))), _this), _this._mouseDownTarget = null, _this._onMenuItemClick = function (option) {
      _this._onAction(option);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsTableMenu, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          entity = _props.entity,
          options = _props.options,
          title = _props.title;

      var entityData = entity.getData();
      var kk = 0;
      var items = options.map(function (option, index) {
        if (!option) {
          return _react2.default.createElement(_DocsMenuItem2.default, { divider: true, key: 'divider-' + kk++ });
        }
        var activeName = option.activeName,
            icon = option.icon,
            label = option.label;

        var active = activeName && !!entityData[activeName];
        return _react2.default.createElement(_DocsMenuItem2.default, {
          active: active,
          icon: icon,
          key: option.action,
          label: label,
          onClick: _this2._onMenuItemClick,
          value: option
        });
      });

      return _react2.default.createElement(
        _DocsDropdownButton2.default,
        { title: title + '\u2026' },
        items
      );
    }
  }, {
    key: '_onAction',
    value: function _onAction(option) {
      var modifier = option.modifier,
          action = option.action;
      var _props2 = this.props,
          getEditor = _props2.getEditor,
          entityKey = _props2.entityKey,
          entity = _props2.entity,
          editorState = _props2.editorState,
          onChange = _props2.onChange;

      var editor = getEditor();
      if (!editor) {
        return;
      }
      var editorProps = editor.props;
      var rowIndex = editorProps.rowIndex,
          cellIndex = editorProps.cellIndex,
          id = editorProps.id;

      if (rowIndex === undefined || cellIndex === undefined) {
        return;
      }
      var entityData = entity.getData();
      var newEntityData = modifier(entityData, rowIndex, cellIndex);
      onChange((0, _DocsModifiers.updateEntityData)(editorState, entityKey, newEntityData));
    }
  }]);
  return DocsTableMenu;
}(_react2.default.PureComponent);

module.exports = DocsTableMenu;
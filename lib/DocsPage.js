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

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _DocsEditor = require('./DocsEditor');

var _DocsEditor2 = _interopRequireDefault(_DocsEditor);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _DocsHelpers = require('./DocsHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocsPage = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsPage, _React$PureComponent);

  function DocsPage() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsPage);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsPage.__proto__ || (0, _getPrototypeOf2.default)(DocsPage)).call.apply(_ref, [this].concat(args))), _this), _this._id = (0, _DocsHelpers.uniqueID)(), _this.state = {
      editorState: _this.props.initialEditorState
    }, _this._onChange = function (editorState) {
      _this.setState({ editorState: editorState });
      _this.props.onChange(editorState);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsPage, [{
    key: 'render',
    value: function render() {
      var attrs = (0, _defineProperty3.default)({}, _DocsDataAttributes2.default.EDITOR_FOR, this._id);
      var editorState = this.state.editorState;

      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({ className: 'docs-examples-page' }, attrs),
        _react2.default.createElement(
          'div',
          { className: 'docs-examples-editor' },
          _react2.default.createElement(_DocsEditor2.default, {
            docsContext: this.props.docsContext,
            editorState: editorState,
            id: this._id,
            onChange: this._onChange
          })
        )
      );
    }
  }]);
  return DocsPage;
}(_react2.default.PureComponent);

module.exports = DocsPage;
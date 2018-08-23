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

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _DocsEventTypes = require('./DocsEventTypes');

var _DocsEventTypes2 = _interopRequireDefault(_DocsEventTypes);

var _DocsMathEditor = require('./DocsMathEditor');

var _DocsMathEditor2 = _interopRequireDefault(_DocsMathEditor);

var _DocsResourcesLoader = require('./DocsResourcesLoader');

var _DocsResourcesLoader2 = _interopRequireDefault(_DocsResourcesLoader);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _renderLatexAsHTML = require('./renderLatexAsHTML');

var _renderLatexAsHTML2 = _interopRequireDefault(_renderLatexAsHTML);

var _showModalDialog = require('./showModalDialog');

var _showModalDialog2 = _interopRequireDefault(_showModalDialog);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _MathModifiers = require('./MathModifiers');

require('./DocsMath.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsMathEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsMathEntityData || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ModalHandle = require('./showModalDialog').babelPluginFlowReactPropTypes_proptype_ModalHandle || require('prop-types').any;

function showMathEditorModalDialog(entityData, callback) {
  return (0, _showModalDialog2.default)(_DocsMathEditor2.default, {
    title: 'Edit Math',
    entityData: entityData
  }, callback);
}

_DocsResourcesLoader2.default.init();

var DocsMath = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsMath, _React$PureComponent);

  function DocsMath() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsMath);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsMath.__proto__ || (0, _getPrototypeOf2.default)(DocsMath)).call.apply(_ref, [this].concat(args))), _this), _this._id = (0, _uniqueID2.default)(), _this._mathEditorModal = null, _this.state = {
      editing: false,
      ready: _DocsResourcesLoader2.default.isReady()
    }, _this._onMathValueSet = function (value) {
      _this.setState({ editing: false });
      if (!value) {
        // cancelled.
        return;
      }
      var _this$props = _this.props,
          entityData = _this$props.entityData,
          onEntityDataChange = _this$props.onEntityDataChange;

      onEntityDataChange((0, _MathModifiers.setMathValue)(entityData, value));
    }, _this._onKatexLoad = function () {
      _this.setState({ ready: true });
    }, _this._onClick = function (e) {
      e.preventDefault();
      _this.setState({ editing: true });
      var entityData = _this.props.entityData;

      _this._mathEditorModal = showMathEditorModalDialog(entityData, _this._onMathValueSet);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsMath, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      _DocsResourcesLoader2.default.on(_DocsEventTypes2.default.LOAD, this._onKatexLoad);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._mathEditorModal && this._mathEditorModal.dispose();
      _DocsResourcesLoader2.default.off(_DocsEventTypes2.default.LOAD, this._onKatexLoad);
    }
  }, {
    key: 'render',
    value: function render() {
      var canEdit = this.context.docsContext.canEdit;
      var _state = this.state,
          editing = _state.editing,
          ready = _state.ready;
      var entityData = this.props.entityData;
      var latex = entityData.latex;

      var className = (0, _classnames2.default)({
        'docs-math': true,
        'docs-math-editing': editing
      });

      var attrs = (0, _defineProperty3.default)({}, _DocsDataAttributes2.default.WIDGET, true);
      var content = ready ? _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: (0, _renderLatexAsHTML2.default)(latex || '') } }) : _react2.default.createElement(
        'span',
        null,
        '...'
      );
      return _react2.default.createElement(
        'span',
        (0, _extends3.default)({}, attrs, {
          className: className,
          contentEditable: false,
          onClick: canEdit ? this._onClick : null }),
        content
      );
    }
  }]);
  return DocsMath;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsMath);
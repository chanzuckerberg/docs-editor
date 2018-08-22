'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _asElement = require('./asElement');

var _asElement2 = _interopRequireDefault(_asElement);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _createDOMCustomEvent = require('./createDOMCustomEvent');

var _createDOMCustomEvent2 = _interopRequireDefault(_createDOMCustomEvent);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lookupElementByAttribute = require('./lookupElementByAttribute');

var _lookupElementByAttribute2 = _interopRequireDefault(_lookupElementByAttribute);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _draftJs = require('draft-js');

require('./DocsDecoratorEntityDataContainer.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ElementLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ElementLike || require('prop-types').any;

var DocsDecoratorEntityDataContainer = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsDecoratorEntityDataContainer, _React$PureComponent);

  function DocsDecoratorEntityDataContainer(WrappedComponent, decoratorType, props, context) {
    (0, _classCallCheck3.default)(this, DocsDecoratorEntityDataContainer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DocsDecoratorEntityDataContainer.__proto__ || (0, _getPrototypeOf2.default)(DocsDecoratorEntityDataContainer)).call(this, props, context));

    _this._WrappedComponent = null;
    _this._decoratorType = '';
    _this._eventsCapture = null;
    _this._id = (0, _uniqueID2.default)();
    _this._node = null;
    _this._timer = new _Timer2.default();
    _this._unmounted = false;

    _this._onEntityDataChange = function (entityData) {
      var editor = _this._getEditorElement();
      if (!editor) {
        return;
      }
      var entityKey = _this.props.entityKey;

      var detail = {
        entityKey: entityKey,
        entityData: entityData
      };
      // Workaround to let editor to catch this change.
      // See `DocsEditorFocusManager`.
      var event = (0, _createDOMCustomEvent2.default)(_DocsEventTypes2.default.EDITOR_REQUEST_UPDATE_ENTITY_DATA, true, true, detail);
      editor.dispatchEvent(event);
    };

    _this._onBeforeCopy = function (e) {
      // TODO: Lazily record the data only if the selection contains the
      // node.
      _this._timer.clear();
      _this._writeEntityData();
    };

    _this._onBeforeCut = function (e) {
      // TODO: Lazily record the data only if the selection contains the
      // node.
      _this._timer.clear();
      _this._writeEntityData();
    };

    _this._onPaste = function (e) {
      // TODO: Lazily record the data only if the selection contains the
      // node.
      _this._timer.set(_this._eraseEntityData);
    };

    _this._eraseEntityData = function () {
      if (!_this._node) {
        return;
      }
      _this._node.removeAttribute(_DocsDataAttributes2.default.DECORATOR_DATA);
      _this._node = null;
    };

    _this._decoratorType = decoratorType;
    _this._WrappedComponent = WrappedComponent;
    return _this;
  }

  (0, _createClass3.default)(DocsDecoratorEntityDataContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._listen();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
      this._unlisten();
      this._timer.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      var _attrs;

      var WrappedComponent = (0, _nullthrows2.default)(this._WrappedComponent);
      var entity = this._getEntity();
      var entityData = entity.getData();
      var align = entityData.align;

      var className = (0, _classnames2.default)({
        'docs-decorator-container': true,
        'docs-decorator-container-align-left': align === 'left',
        'docs-decorator-container-align-right': align === 'right',
        'docs-decorator-container-align-center': align === 'center',
        'docs-decorator-container-align-none': align === 'none'
      });

      var attrs = (_attrs = {}, (0, _defineProperty3.default)(_attrs, _DocsDataAttributes2.default.DECORATOR_TYPE, this._decoratorType), (0, _defineProperty3.default)(_attrs, _DocsDataAttributes2.default.ELEMENT, true), _attrs);

      var children = this.props.children;

      var immutable = entity.getMutability() === 'IMMUTABLE';
      // If immutable, assume children may not be rendered, thus render
      // children here instead to keep the character data visible.
      if (immutable) {
        return _react2.default.createElement(
          'span',
          (0, _extends3.default)({}, attrs, { className: className }),
          _react2.default.createElement(WrappedComponent, {
            entityData: entityData,
            onEntityDataChange: this._onEntityDataChange
          }),
          children
        );
      } else {
        return _react2.default.createElement(WrappedComponent, (0, _extends3.default)({}, attrs, {
          children: children,
          className: className,
          entityData: entityData,
          onEntityDataChange: this._onEntityDataChange
        }));
      }
    }
  }, {
    key: '_getEditorElement',
    value: function _getEditorElement() {
      return (0, _lookupElementByAttribute2.default)((0, _asElement2.default)(_reactDom2.default.findDOMNode(this)), _DocsDataAttributes2.default.EDITOR_FOR);
    }
  }, {
    key: '_listen',
    value: function _listen() {
      if (this._eventsCapture || this._unmounted) {
        return;
      }
      this._eventsCapture = (0, _captureDocumentEvents2.default)({
        'beforecopy': this._onBeforeCopy,
        'beforecut': this._onBeforeCut
      });
    }
  }, {
    key: '_unlisten',
    value: function _unlisten() {
      if (!this._eventsCapture) {
        return;
      }
      this._eventsCapture && this._eventsCapture.dispose();
      this._eventsCapture = null;
    }
  }, {
    key: '_writeEntityData',
    value: function _writeEntityData() {
      // Wtites the state of the AtomicBlock into DOM element so that its state
      // could be copied and pasted into a different editor. See `pasteHTML`
      // at `DocsModifier` and see how the data is being parsed.
      if (this._unmounted) {
        return;
      }
      // Inject EntityData as node so that they could be copied.0
      var node = (0, _asElement2.default)(_reactDom2.default.findDOMNode(this));
      this._node = node;

      var entity = this._getEntity();
      var rawEntity = {
        data: entity.getData(),
        type: entity.getType(),
        mutability: entity.getMutability()
      };
      node.setAttribute(_DocsDataAttributes2.default.DECORATOR_DATA, (0, _stringify2.default)(rawEntity));
    }
  }, {
    key: '_getEntity',
    value: function _getEntity() {
      var _props = this.props,
          contentState = _props.contentState,
          entityKey = _props.entityKey;

      return (0, _nullthrows2.default)((0, _nullthrows2.default)(contentState).getEntity(entityKey));
    }
  }]);
  return DocsDecoratorEntityDataContainer;
}(_react2.default.PureComponent);

module.exports = DocsDecoratorEntityDataContainer;
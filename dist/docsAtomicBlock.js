'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _draftJs = require('draft-js');

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocsAtomicBlock = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsAtomicBlock, _React$PureComponent);

  function DocsAtomicBlock(WrappedComponent, spec, props, context) {
    (0, _classCallCheck3.default)(this, DocsAtomicBlock);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DocsAtomicBlock.__proto__ || (0, _getPrototypeOf2.default)(DocsAtomicBlock)).call(this, props, context));

    _this._WrappedComponent = null;
    _this._atomicNode = null;
    _this._eventsCapture = null;
    _this._ref = null;
    _this._spec = null;
    _this._timer = new _Timer2.default();

    _this._onRef = function (ref) {
      _this._ref = ref;
      _this._listen();
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
      if (!_this._ref || !_this._atomicNode) {
        return;
      }
      _this._atomicNode.removeAttribute(_DocsDataAttributes2.default.ATOMIC_BLOCK_DATA);
      _this._atomicNode = null;
    };

    _this._WrappedComponent = WrappedComponent;
    _this._spec = spec;
    return _this;
  }

  (0, _createClass3.default)(DocsAtomicBlock, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unlisten();
      this._timer.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      var WrappedComponent = (0, _nullthrows2.default)(this._WrappedComponent);
      return _react2.default.createElement(WrappedComponent, (0, _extends3.default)({}, this.props, { ref: this._onRef }));
    }
  }, {
    key: '_listen',
    value: function _listen() {
      if (this._eventsCapture || !this._ref) {
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
      this._eventsCapture.dispose();
      this._eventsCapture = null;
    }
  }, {
    key: '_writeEntityData',
    value: function _writeEntityData() {
      // Wtites the state of the AtomicBlock into DOM element so that its state
      // could be copied and pasted into a different editor. See `pasteHTML`
      // at `DocsModifier` and see how the data is being parsed.
      if (!this._ref) {
        return;
      }
      // Inject EntityData as node so that they could be copied.0
      var blockProps = this.props.blockProps;
      var entity = blockProps.entity;

      var node = (0, _nullthrows2.default)(_reactDom2.default.findDOMNode(this._ref));
      var atomicNode = (0, _nullthrows2.default)(node.parentElement);
      (0, _invariant2.default)(atomicNode.nodeName === 'FIGURE' && atomicNode.hasAttribute('data-block'), 'atomicNode not found');
      var meta = {
        entityData: entity.getData(),
        blockType: (0, _nullthrows2.default)(this._spec).blockType
      };
      atomicNode.setAttribute(_DocsDataAttributes2.default.ATOMIC_BLOCK_DATA, (0, _stringify2.default)(meta));
      this._atomicNode = atomicNode;
    }
  }]);
  return DocsAtomicBlock;
}(_react2.default.PureComponent);

function docsAtomicBlock(Component, spec) {
  var fn = DocsAtomicBlock;
  return fn.bind(null, Component, spec);
}

module.exports = docsAtomicBlock;
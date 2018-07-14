'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _reactBootstrap = require('react-bootstrap');

var _DocsHelpers = require('./DocsHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Modal = function (_React$PureComponent) {
  (0, _inherits3.default)(Modal, _React$PureComponent);

  function Modal() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Modal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Modal.__proto__ || (0, _getPrototypeOf2.default)(Modal)).call.apply(_ref, [this].concat(args))), _this), _this._eventsCapture = null, _this._startTime = Date.now(), _this._unmounted = false, _this._onEventCapture = function (e) {
      var id = _this.props.id;

      var target = e.target;
      var node = document.getElementById(id);
      var inComponent = node === target || node && node.contains(target);
      if (inComponent) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      // Prevents the initial click from dismissing it.
      var delta = Date.now() - _this._startTime;
      var dismissable = delta >= 500 && e.type === 'click';
      dismissable && _this._autoDismiss();
    }, _this._autoDismiss = function () {
      !_this._unmounted && _this.props.onCancel();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Modal, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          title = _props.title,
          viewProps = _props.viewProps,
          onConfirm = _props.onConfirm,
          onCancel = _props.onCancel,
          View = _props.View;

      return _react2.default.createElement(
        _reactBootstrap.Popover,
        {
          className: 'modal-dialog',
          id: id,
          placement: 'top',
          title: title },
        _react2.default.createElement(View, (0, _extends3.default)({}, viewProps, {
          onCancel: onCancel,
          onConfirm: onConfirm
        }))
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._eventsCapture = (0, _captureDocumentEvents2.default)({
        click: this._onEventCapture,
        mousedown: this._onEventCapture
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
      this._eventsCapture && this._eventsCapture.dispose();
    }
  }]);
  return Modal;
}(_react2.default.PureComponent);

function getRootElement(id) {
  var root = document.body || document.documentElement;
  var element = document.getElementById(id) || document.createElement('div');
  element.className = 'modal-dialog-root';
  element.id = id;
  if (!element.parentNode) {
    root.insertBefore(element, element.firstChild);
  }
  return element;
}

function renderModal(props) {
  var id = props.id;

  var rootNode = getRootElement(id);
  var component = _react2.default.createElement(Modal, (0, _extends3.default)({}, props, { id: id + '-modal' }));
  _reactDom2.default.render(component, rootNode);
}

renderModal.propTypes = {
  View: require('prop-types').func.isRequired,
  id: require('prop-types').string.isRequired,
  onCancel: require('prop-types').func.isRequired,
  onConfirm: require('prop-types').func.isRequired,
  title: require('prop-types').string,
  viewProps: require('prop-types').object.isRequired
};
renderModal.propTypes = {
  View: require('prop-types').func.isRequired,
  id: require('prop-types').string.isRequired,
  onCancel: require('prop-types').func.isRequired,
  onConfirm: require('prop-types').func.isRequired,
  title: require('prop-types').string,
  viewProps: require('prop-types').object.isRequired
};
function unrenderModal(props) {
  var id = props.id;

  var rootNode = getRootElement(id);
  _reactDom2.default.unmountComponentAtNode(rootNode);
  rootNode.parentNode && rootNode.parentNode.removeChild(rootNode);
}

function docsShowModalDialog(View, viewProps) {
  return new _promise2.default(function (resolve) {
    var props = {
      View: View,
      viewProps: viewProps,
      id: (0, _DocsHelpers.uniqueID)(),
      onCancel: function onCancel() {
        unrenderModal(props);
        resolve(undefined);
      },
      onConfirm: function onConfirm(value) {
        unrenderModal(props);
        resolve(value);
      }
    };
    renderModal(props);
  });
}

module.exports = docsShowModalDialog;
'use strict';

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _reactBootstrap = require('react-bootstrap');

require('./showModalDialog.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ModalHandle', {
  value: require('prop-types').shape({
    dispose: require('prop-types').func.isRequired,
    update: require('prop-types').func.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ModalDialogProps', {
  value: require('prop-types').shape({
    onCancel: require('prop-types').func.isRequired,
    onConfirm: require('prop-types').func.isRequired
  })
});


var openModalCount = 0;
var bodyScrollPosition = 0;
function preserveBodyScrollPosition() {
  openModalCount++;

  if (openModalCount > 1) {
    return;
  }

  bodyScrollPosition = window.pageYOffset;
  (0, _nullthrows2.default)(document.body).style.top = '-' + bodyScrollPosition + 'px';
  (0, _nullthrows2.default)(document.body).classList.add('no-scroll-body');
}

function restoreBodyScrollPosition() {
  openModalCount--;

  if (openModalCount > 0) {
    return;
  }

  (0, _nullthrows2.default)(document.body).classList.remove('no-scroll-body');
  window.scrollTo(0, bodyScrollPosition);
  (0, _nullthrows2.default)(document.body).style.top = '0';
  bodyScrollPosition = 0;
}

var ROOT_CLASS_NAME = 'global-modal-dialog-root';

var Modal = function (_React$PureComponent) {
  (0, _inherits3.default)(Modal, _React$PureComponent);

  function Modal() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Modal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Modal.__proto__ || (0, _getPrototypeOf2.default)(Modal)).call.apply(_ref, [this].concat(args))), _this), _this._clickStartTarget = null, _this._clickStartTime = 0, _this._eventsCapture = null, _this._unmounted = false, _this._onEventCapture = function (e) {
      var _this$props = _this.props,
          id = _this$props.id,
          autoDimiss = _this$props.autoDimiss;

      if (!autoDimiss) {
        _this._resetClick();
        return;
      }

      var target = e.target,
          type = e.type;

      var node = document.getElementById(id);

      var inComponent = node === target || node && node.contains(target);
      if (inComponent) {
        _this._resetClick();
        return;
      }

      var parentNode = node ? node.parentElement : null;
      if (parentNode && parentNode.getAttribute && parentNode.getAttribute('aria-hidden') === 'true') {
        // Touched a modal that is not interactive.
        _this._resetClick();
        return;
      }

      // Find all app alerts.
      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_alert_role
      var alertNodes = document.querySelectorAll('[role="alert"]');
      var inAlert = (0, _from2.default)(alertNodes).some(function (an) {
        return an === target || an.contains(target);
      });

      if (inAlert) {
        // Touched an alert dialog. Interacting with the alert (e.g. dismiss it)
        // should not dismiss the modal.
        _this._resetClick();
        return;
      }

      if (type === 'mouseup' && !_this._clickStartTime) {
        // It does not create a click.
        _this._resetClick();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // This checks if user did click outside of the modal dialog.
      // Both `mousedown` and `mouseup` must happen outside of the modal's
      // element. The interaction must finish within 500ms, just like a real
      // click.
      if (type === 'mousedown') {
        _this._clickStartTime = Date.now();
        _this._clickStartTarget = target;
      } else if (type === 'mouseup' && _this._clickStartTime && _this._clickStartTarget === target) {
        var delta = Date.now() - _this._clickStartTime;
        var clickedOutside = delta <= 500;
        clickedOutside && _this._autoDismiss();
        _this._resetClick();
      }
    }, _this._onKeyDown = function (e) {
      var modalRoot = document.getElementById(_this.props.id);
      if (!modalRoot || e.key !== 'Tab') {
        return;
      }

      // Focusable selectors list from https://stackoverflow.com/a/30753870
      var selector = 'button:not([disabled]), [href], iframe, input:not([disabled]), select:not([disabled]),\n      textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contentEditable=true]';
      // Filter out hidden elements
      var focusableElements = (0, _from2.default)(modalRoot.querySelectorAll(selector)).filter(function (element) {
        return !!element.offsetHeight;
      });
      if (!focusableElements.length) {
        return;
      }

      var firstFocusableElement = focusableElements[0];
      var lastFocusableElement = focusableElements[focusableElements.length - 1];
      var target = e.target;


      if (firstFocusableElement === lastFocusableElement) {
        e.preventDefault();
      } else if (e.shiftKey && target === firstFocusableElement) {
        // shift + tab pressed on first element, wrap back to last
        lastFocusableElement.focus();
        e.preventDefault();
      } else if (target === lastFocusableElement) {
        // tab pressed on last element, wrap back to first
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }, _this._autoDismiss = function () {
      !_this._unmounted && _this.props.onCancel();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Modal, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          viewProps = _props.viewProps,
          onConfirm = _props.onConfirm,
          onCancel = _props.onCancel,
          View = _props.View;

      return _react2.default.createElement(
        _reactBootstrap.Popover,
        {
          className: 'global-modal-dialog',
          id: id,
          onKeyDown: this._onKeyDown,
          placement: 'top'
        },
        _react2.default.createElement(View, (0, _extends3.default)({}, viewProps, { onCancel: onCancel, onConfirm: onConfirm }))
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._eventsCapture = (0, _captureDocumentEvents2.default)({
        mousedown: this._onEventCapture,
        mouseup: this._onEventCapture
      });
      preserveBodyScrollPosition();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
      this._eventsCapture && this._eventsCapture.dispose();
      restoreBodyScrollPosition();
    }

    // Follows https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700

  }, {
    key: '_resetClick',
    value: function _resetClick() {
      this._clickStartTarget = null;
      this._clickStartTime = 0;
    }
  }]);
  return Modal;
}(_react2.default.PureComponent);

function getRootElement(id) {
  var root = document.body || document.documentElement;
  var element = document.getElementById(id) || document.createElement('div');
  element.className = ROOT_CLASS_NAME + ' docs-font-default';
  element.id = id;
  // Populates the default ARIA attributes here.
  // http://accessibility.athena-ict.com/aria/examples/dialog.shtml
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  if (!element.parentElement) {
    root.appendChild(element);
  }
  return element;
}

function renderModal(props) {
  var id = props.id;

  var rootNode = getRootElement(id);
  var component = _react2.default.createElement(Modal, (0, _extends3.default)({}, props, { id: id + '-modal' }));
  _reactDom2.default.render(component, rootNode);
  resetModalsAccessibility();
}

renderModal.propTypes = {
  View: require('prop-types').func.isRequired,
  autoDimiss: require('prop-types').bool,
  id: require('prop-types').string.isRequired,
  onCancel: require('prop-types').func.isRequired,
  onConfirm: require('prop-types').func.isRequired,
  viewProps: require('prop-types').object.isRequired
};
renderModal.propTypes = {
  View: require('prop-types').func.isRequired,
  autoDimiss: require('prop-types').bool,
  id: require('prop-types').string.isRequired,
  onCancel: require('prop-types').func.isRequired,
  onConfirm: require('prop-types').func.isRequired,
  viewProps: require('prop-types').object.isRequired
};
function unrenderModal(props) {
  var id = props.id;

  var rootNode = getRootElement(id);
  _reactDom2.default.unmountComponentAtNode(rootNode);
  rootNode.parentElement && rootNode.parentElement.removeChild(rootNode);
  resetModalsAccessibility();
}

// https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/dialog-modal/dialog.html
function resetModalsAccessibility() {
  var els = document.querySelectorAll('.' + ROOT_CLASS_NAME);
  var lastIndex = els.length - 1;
  var ii = 0;
  while (ii <= lastIndex) {
    var el = els[ii];
    if (ii < lastIndex) {
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.removeAttribute('aria-hidden');
    }
    ii++;
  }
}

function showModalDialog(View, modalProps, callback) {
  var done = false;
  var autoDimiss = modalProps.autoDimiss,
      viewProps = (0, _objectWithoutProperties3.default)(modalProps, ['autoDimiss']);

  var props = {
    View: View,
    autoDimiss: autoDimiss,
    viewProps: viewProps,
    id: (0, _uniqueID2.default)(),
    onCancel: function onCancel() {
      if (!done) {
        done = true;
        unrenderModal(props);
        callback && callback(undefined);
      }
    },
    onConfirm: function onConfirm(value) {
      if (!done) {
        done = true;
        unrenderModal(props);
        callback && callback(value);
      }
    }
  };
  renderModal(props);
  return {
    dispose: function dispose() {
      // Close the modal dialog and silence the callback.
      callback = null;
      props.onCancel();
    },
    update: function update(nextViewProps) {
      if (!done) {
        var nextProps = (0, _extends3.default)({}, props, {
          viewProps: nextViewProps
        });
        renderModal(nextProps);
      }
    }
  };
}

module.exports = showModalDialog;
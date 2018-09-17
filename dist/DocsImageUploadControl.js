'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _DocsEditorRuntime = require('./DocsEditorRuntime');

var _DocsEditorRuntime2 = _interopRequireDefault(_DocsEditorRuntime);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ImageLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ImageLike || require('prop-types').any;

var DocsImageUploadControl = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsImageUploadControl, _React$PureComponent);

  function DocsImageUploadControl() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsImageUploadControl);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsImageUploadControl.__proto__ || (0, _getPrototypeOf2.default)(DocsImageUploadControl)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      inputID: (0, _uniqueID2.default)()
    }, _this._unmounted = false, _this._onSelectFile = function (event) {
      var file = event.target.files && event.target.files[0];
      if (file && (typeof file === 'undefined' ? 'undefined' : (0, _typeof3.default)(file)) === 'object') {
        _this._upload(file);
      }
    }, _this._upload = function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(file) {
        var _this$props, _runtime, _onStart, image;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _this$props = _this.props, _runtime = _this$props.runtime, _onStart = _this$props.onStart;

                _onStart();
                _context.next = 5;
                return _runtime.uploadImage(file);

              case 5:
                image = _context.sent;

                _this._onSuccess(image);
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](0);

                _this._onError(_context.t0);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2, [[0, 9]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this._onSuccess = function (image) {
      if (_this._unmounted) {
        return;
      }
      // Clear the selected file.
      _this.setState({ inputID: (0, _uniqueID2.default)() });
      _this.props.onSuccess(image);
    }, _this._onError = function (error) {
      if (_this._unmounted) {
        return;
      }
      // Clear the selected file.
      _this.setState({ inputID: (0, _uniqueID2.default)() });
      _this.props.onError(error);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsImageUploadControl, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
    }
  }, {
    key: 'render',
    value: function render() {
      var inputID = this.state.inputID;
      var disabled = this.props.disabled;

      return _react2.default.createElement(
        'label',
        { className: 'docs-image-upload-control', htmlFor: inputID },
        _react2.default.createElement(
          'span',
          null,
          'Upload Image'
        ),
        _react2.default.createElement('input', {
          accept: 'image/png,image/gif,image/jpeg,image/jpg',
          className: 'docs-image-upload-control-input',
          id: inputID,
          key: inputID,
          onChange: disabled ? null : this._onSelectFile,
          readOnly: disabled,
          type: 'file'
        })
      );
    }
  }]);
  return DocsImageUploadControl;
}(_react2.default.PureComponent);

exports.default = DocsImageUploadControl;
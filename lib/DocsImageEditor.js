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

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _DocsDropdownButton = require('./DocsDropdownButton');

var _DocsDropdownButton2 = _interopRequireDefault(_DocsDropdownButton);

var _DocsImageUploadControl = require('./DocsImageUploadControl');

var _DocsImageUploadControl2 = _interopRequireDefault(_DocsImageUploadControl);

var _DocsMenuItem = require('./DocsMenuItem');

var _DocsMenuItem2 = _interopRequireDefault(_DocsMenuItem);

var _DocsSafeImage = require('./DocsSafeImage');

var _DocsSafeImage2 = _interopRequireDefault(_DocsSafeImage);

var _DocsInput = require('./DocsInput');

var _DocsInput2 = _interopRequireDefault(_DocsInput);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _docsWithContext = require('./docsWithContext');

var _docsWithContext2 = _interopRequireDefault(_docsWithContext);

var _reactBootstrap = require('react-bootstrap');

var _DocsImageModifiers = require('./DocsImageModifiers');

require('./DocsImageEditor.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DOMImage = require('./Types').babelPluginFlowReactPropTypes_proptype_DOMImage || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ImageEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_ImageEntityData || require('prop-types').any;

var ENTER_CODE = 13;

var SPECS = [{
  action: _DocsActionTypes2.default.IMAGE_ALIGN_LEFT,
  label: 'Align Left',
  prop: 'align',
  value: 'left'
}, {
  action: _DocsActionTypes2.default.IMAGE_ALIGN_RIGHT,
  label: 'Align Right',
  prop: 'align',
  value: 'right'
}, {
  action: _DocsActionTypes2.default.IMAGE_ALIGN_CENTER,
  label: 'Align Center',
  prop: 'align',
  value: 'center'
},
// {
//   action: DocsActionTypes.IMAGE_ALIGN_NONE,
//   label: 'Align None',
//   prop: 'align',
//   value: false,
// },
{
  divider: true
}, {
  action: _DocsActionTypes2.default.IMAGE_TOGGLE_FRAME,
  label: 'Toggle Frame',
  prop: 'frame',
  value: true
}];

function getInitialState(props) {
  var data = props.entityData || {};
  var url = data.url,
      width = data.width,
      height = data.height;

  var validatedImage = url && width && height ? {
    src: url,
    width: width,
    height: height
  } : null;

  return {
    data: data,
    errorMessage: '',
    isUploading: false,
    isValidating: false,
    validatedImage: validatedImage
  };
}

/**
 * This component let you to select a valid image and only valid image can be
 * selected.
*/

var DocsImageEditor = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsImageEditor, _React$PureComponent);

  function DocsImageEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsImageEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsImageEditor.__proto__ || (0, _getPrototypeOf2.default)(DocsImageEditor)).call.apply(_ref, [this].concat(args))), _this), _this.state = getInitialState(_this.props), _this._onKeyDown = function (e) {
      var keyCode = e.keyCode;
      var url = _this.state.data.url;

      if (keyCode === ENTER_CODE && url) {
        _this._confirm();
      }
    }, _this._onMenuItemClick = function (spec) {
      var data = _this.state.data;
      var align = data.align,
          frame = data.frame;

      switch (spec.action) {
        case _DocsActionTypes2.default.IMAGE_ALIGN_LEFT:
          align = 'left';
          break;

        case _DocsActionTypes2.default.IMAGE_ALIGN_RIGHT:
          align = 'right';
          break;

        case _DocsActionTypes2.default.IMAGE_ALIGN_CENTER:
          align = 'center';
          break;

        case _DocsActionTypes2.default.IMAGE_ALIGN_NONE:
          align = '';
          break;

        case _DocsActionTypes2.default.IMAGE_TOGGLE_FRAME:
          frame = !frame;
          break;
        default:
          return;
      }

      _this.setState({
        data: (0, _extends3.default)({}, data, {
          align: align,
          frame: frame
        })
      });
    }, _this._confirm = function () {
      var onConfirm = _this.props.onConfirm;
      var _this$state = _this.state,
          data = _this$state.data,
          validatedImage = _this$state.validatedImage;

      if (validatedImage) {
        onConfirm(data);
      }
    }, _this._cancel = function () {
      var onCancel = _this.props.onCancel;

      onCancel();
    }, _this._onUrlChange = function (e) {
      _this.setState({
        data: (0, _DocsImageModifiers.setURL)(_this.state.data, e.target.value),
        errorMessage: '',
        isValidating: true,
        validatedImage: null
      });
    }, _this._onValidateSuccess = function (image) {
      var data = _this.state.data;
      var src = image.src,
          width = image.width,
          height = image.height;

      _this.setState({
        data: (0, _extends3.default)({}, data, {
          height: height,
          url: src,
          width: width
        }),
        isValidating: false,
        validatedImage: image
      });
    }, _this._onValidateError = function (error) {
      _this.setState({
        isValidating: false,
        validatedImage: null,
        errorMessage: error.message
      });
    }, _this._onUploadStart = function () {
      _this.setState({
        errorMessage: '',
        isUploading: true,
        validatedImage: null
      });
    }, _this._onUploadSuccess = function (image) {
      var src = image.src,
          width = image.width,
          height = image.height;
      var data = _this.state.data;

      _this.setState({
        data: (0, _extends3.default)({}, data, {
          url: src,
          width: width,
          height: height
        }),
        isUploading: false,
        // The image will be validated by <DocsSafeImage /> after the new url is
        // assigned.
        isValidating: true,
        validatedImage: null
      });
    }, _this._onUploadError = function (error) {
      _this.setState({
        errorMessage: error.message,
        isUploading: false,
        isValidating: false,
        validatedImage: null
      });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsImageEditor, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var runtime = this.props.docsContext.runtime;
      var _state = this.state,
          errorMessage = _state.errorMessage,
          data = _state.data,
          isUploading = _state.isUploading,
          isValidating = _state.isValidating,
          validatedImage = _state.validatedImage;
      var url = data.url;

      var items = SPECS.map(function (spec, index) {
        var label = spec.label,
            prop = spec.prop,
            value = spec.value,
            divider = spec.divider;

        if (divider) {
          return _react2.default.createElement(_DocsMenuItem2.default, {
            divider: true,
            key: 'divider' + String(index)
          });
        }
        var active = false;

        if (typeof value === 'boolean') {
          active = !!data[prop];
        } else if (prop === 'align' && value === 'center') {
          var val = data[prop];
          active = val === value || !val;
        } else {
          active = data[prop] === value;
        }

        return _react2.default.createElement(_DocsMenuItem2.default, {
          active: active,
          key: spec.action,
          label: label,
          onClick: _this2._onMenuItemClick,
          value: spec
        });
      });

      var uploadControl = runtime && runtime.canUploadImage() ? _react2.default.createElement(
        'span',
        { className: 'docs-image-editor-upload-control' },
        _react2.default.createElement(_DocsImageUploadControl2.default, {
          disabled: isUploading || isValidating,
          onError: this._onUploadError,
          onStart: this._onUploadStart,
          onSuccess: this._onUploadSuccess,
          runtime: runtime
        })
      ) : null;

      var alert = null;
      if (errorMessage) {
        alert = _react2.default.createElement(
          _reactBootstrap.Alert,
          { bsStyle: 'danger' },
          _react2.default.createElement(
            'b',
            null,
            'Error'
          ),
          ' : ',
          errorMessage
        );
      } else if (isValidating || isUploading) {
        alert = _react2.default.createElement(
          _reactBootstrap.Alert,
          { bsStyle: 'info' },
          'processing'
        );
      }

      var preview = url ? _react2.default.createElement(
        'div',
        {
          className: 'docs-image-editor-preview',
          style: { backgroundImage: 'url(' + url + ')' } },
        _react2.default.createElement(_DocsSafeImage2.default, {
          height: 1,
          onError: this._onValidateError,
          onLoad: this._onValidateSuccess,
          src: url,
          width: 1
        }),
        alert
      ) : null;

      return _react2.default.createElement(
        'div',
        { className: 'docs-image-editor' },
        _react2.default.createElement(
          'div',
          { className: 'docs-image-editor-inputs' },
          _react2.default.createElement(
            _DocsDropdownButton2.default,
            { title: 'Styles' },
            items
          ),
          _react2.default.createElement(_DocsInput2.default, {
            onChange: this._onUrlChange,
            onKeyDown: this._onKeyDown,
            placeholder: 'Enter image url',
            readOnly: isUploading,
            type: 'text',
            value: url || ''
          }),
          uploadControl
        ),
        _react2.default.createElement(
          'div',
          null,
          preview
        ),
        _react2.default.createElement(
          'div',
          { className: 'docs-image-editor-buttons' },
          _react2.default.createElement(
            _reactBootstrap.Button,
            {
              bsSize: 'small',
              bsStyle: 'primary',
              disabled: !validatedImage,
              onClick: this._confirm },
            'Apply'
          ),
          _react2.default.createElement(
            _reactBootstrap.Button,
            {
              bsSize: 'small',
              onClick: this._cancel },
            'Cancel'
          )
        )
      );
    }
  }]);
  return DocsImageEditor;
}(_react2.default.PureComponent);

module.exports = (0, _docsWithContext2.default)(DocsImageEditor);
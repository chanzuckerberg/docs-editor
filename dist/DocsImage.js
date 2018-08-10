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

var _DocsImageEditor = require('./DocsImageEditor');

var _DocsImageEditor2 = _interopRequireDefault(_DocsImageEditor);

var _DocsImageResizeHandle = require('./DocsImageResizeHandle');

var _DocsImageResizeHandle2 = _interopRequireDefault(_DocsImageResizeHandle);

var _DocsSafeImage = require('./DocsSafeImage');

var _DocsSafeImage2 = _interopRequireDefault(_DocsSafeImage);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ResizeObserver = require('./ResizeObserver');

var _ResizeObserver2 = _interopRequireDefault(_ResizeObserver);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _showModalDialog = require('./showModalDialog');

var _showModalDialog2 = _interopRequireDefault(_showModalDialog);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _asElement = require('./asElement');

var _asElement2 = _interopRequireDefault(_asElement);

var _DocsImageModifiers = require('./DocsImageModifiers');

require('./DocsImage.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ImageLike = require('./Types').babelPluginFlowReactPropTypes_proptype_ImageLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocsImageEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsImageEntityData || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ModalHandle = require('./showModalDialog').babelPluginFlowReactPropTypes_proptype_ModalHandle || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry = require('./ResizeObserver').babelPluginFlowReactPropTypes_proptype_ResizeObserverEntry || require('prop-types').any;

function showImageEditorModalDialog(docsContext, entityData, callback) {
  return (0, _showModalDialog2.default)(_DocsImageEditor2.default, {
    title: 'Edit Image',
    entityData: entityData,
    docsContext: docsContext
  }, callback);
}

var DocsImage = function (_React$Component) {
  (0, _inherits3.default)(DocsImage, _React$Component);

  function DocsImage() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsImage);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsImage.__proto__ || (0, _getPrototypeOf2.default)(DocsImage)).call.apply(_ref, [this].concat(args))), _this), _this._imageEditorModal = null, _this._imageID = (0, _uniqueID2.default)(), _this._container = null, _this._unmounted = false, _this.state = {
      error: false,
      editing: false,
      resizeChange: null
    }, _this._onRef = function (ref) {
      if (_this._container) {
        // Remove old listener.
        _ResizeObserver2.default.unobserve((0, _asElement2.default)(_this._container));
      }
      if (ref) {
        // Register new listener.
        _this._container = (0, _asElement2.default)(_reactDom2.default.findDOMNode(ref));
        _ResizeObserver2.default.observe(_this._container, _this._onContainerResize);
      }
    }, _this._onContainerResize = function (info) {
      var _this$props$entityDat = _this.props.entityData,
          width = _this$props$entityDat.width,
          height = _this$props$entityDat.height,
          url = _this$props$entityDat.url;

      var element = document.getElementById(_this._imageID);
      if (element && width && height && url) {
        var image = {
          height: Number(height),
          id: _this._imageID,
          src: String(url),
          width: Number(width)
        };
        _this._calibrateSize(image);
      }
    }, _this._onLoad = function (image) {
      _this.setState({ error: false });
      _this._calibrateSize(image);
    }, _this._calibrateSize = function (image) {
      var entityData = _this.props.entityData;
      var src = image.src,
          width = image.width,
          height = image.height,
          id = image.id;

      if (src === entityData.url && width && height) {
        // If the displayed image is wider than the maximum width allowed,
        // we'd constraint the width to avoid broken layout.
        var element = id ? document.getElementById(id) : null;
        var el = (0, _nullthrows2.default)(element);
        var maxWidth = _DocsImageResizeHandle2.default.getMaxResizeWidth(el);
        var aspectRatio = width / height;
        if (entityData.width && entityData.height) {
          if (entityData.width > maxWidth) {
            // Update the exising saved size.
            var newWidth = maxWidth;
            var newHeight = maxWidth / aspectRatio;
            _this._onImageResizeEnd(newWidth, newHeight);
          }
        } else if (width > maxWidth) {
          var _newWidth = maxWidth;
          var _newHeight = maxWidth / aspectRatio;
          _this._onImageResizeEnd(_newWidth, _newHeight);
        } else if (!entityData.width || !entityData.height) {
          // Save the current loaded size to `entityData`.
          _this._onImageResizeEnd(width, height);
        }
      }
    }, _this._onError = function () {
      _this.setState({ error: true });
    }, _this._onClick = function (e) {
      e.preventDefault();
      _this.setState({ editing: true });
      var docsContext = _this.context.docsContext;
      var entityData = _this.props.entityData;

      _this._imageEditorModal = showImageEditorModalDialog(docsContext, entityData, _this._onEntityDataChange);
    }, _this._onImageResizeEnd = function (w, h) {
      var canEdit = _this.context.docsContext.canEdit;
      var _this$props = _this.props,
          entityData = _this$props.entityData,
          onEntityDataChange = _this$props.onEntityDataChange;

      var newEntityData = (0, _DocsImageModifiers.setSize)(entityData, w, h);
      _this.setState({
        resizeChange: newEntityData
      });
      canEdit && onEntityDataChange(newEntityData);
    }, _this._onEntityDataChange = function (data) {
      if (_this._unmounted) {
        return;
      }
      _this.setState({ editing: false });
      if (data === undefined) {
        return;
      }
      _this.props.onEntityDataChange(data);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsImage, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
      this._imageEditorModal && this._imageEditorModal.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      var entityData = this.props.entityData;
      var url = entityData.url;
      var canEdit = this.context.docsContext.canEdit;
      var _state = this.state,
          editing = _state.editing,
          resizeChange = _state.resizeChange;
      var width = entityData.width,
          height = entityData.height;

      var resizeHandle = canEdit ? _react2.default.createElement(_DocsImageResizeHandle2.default, {
        imageID: this._imageID,
        onImageResizeEnd: this._onImageResizeEnd
      }) : null;
      var className = (0, _classnames2.default)({
        'docs-image': true,
        'docs-image-editing': editing,
        'docs-image-with-frame': !!entityData.frame
      });
      var attrs = (0, _defineProperty3.default)({}, _DocsDataAttributes2.default.TOOL, true);

      if (resizeChange && url && resizeChange.url === url) {
        // User did resize locally, use the local image size instead.
        // The prevents the image from jumping between the local image size
        // and the saved image size.
        width = resizeChange.width;
        height = resizeChange.height;
      }

      return _react2.default.createElement(
        'span',
        { className: className, ref: this._onRef },
        _react2.default.createElement(
          'span',
          (0, _extends3.default)({}, attrs, {
            className: 'docs-image-body',
            contentEditable: false }),
          _react2.default.createElement(_DocsSafeImage2.default, {
            height: height,
            id: this._imageID,
            onClick: canEdit ? this._onClick : null,
            onError: this._onError,
            onLoad: this._onLoad,
            src: url,
            width: width
          }),
          resizeHandle
        )
      );
    }
  }]);
  return DocsImage;
}(_react2.default.Component);

module.exports = (0, _withDocsContext2.default)(DocsImage);
'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

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

var _DocsBaseEditor = require('./DocsBaseEditor');

var _DocsBaseEditor2 = _interopRequireDefault(_DocsBaseEditor);

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _DocsEventTypes = require('./DocsEventTypes');

var _DocsEventTypes2 = _interopRequireDefault(_DocsEventTypes);

var _DocsIcon = require('./DocsIcon');

var _DocsIcon2 = _interopRequireDefault(_DocsIcon);

var _DocsTextInputEditor = require('./DocsTextInputEditor');

var _DocsTextInputEditor2 = _interopRequireDefault(_DocsTextInputEditor);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _convertFromRaw = require('./convertFromRaw');

var _convertFromRaw2 = _interopRequireDefault(_convertFromRaw);

var _convertToRaw = require('./convertToRaw');

var _convertToRaw2 = _interopRequireDefault(_convertToRaw);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _showModalDialog = require('./showModalDialog');

var _showModalDialog2 = _interopRequireDefault(_showModalDialog);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _updateEntityData = require('./updateEntityData');

var _updateEntityData2 = _interopRequireDefault(_updateEntityData);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _draftJs = require('draft-js');

var _DocsExpandableModifiers = require('./DocsExpandableModifiers');

require('./DocsExpandable.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsEditorLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_ModalHandle = require('./showModalDialog').babelPluginFlowReactPropTypes_proptype_ModalHandle || require('prop-types').any;

var LOCAL_CHANGE_ID = '_docs_expandable_local_change';

function showLabelEditorModalDialog(placeholder, label, callback) {
  return (0, _showModalDialog2.default)(_DocsTextInputEditor2.default, {
    placeholder: placeholder,
    value: label
  }, callback);
}

function getLocalEditorState(props) {
  var blockProps = props.blockProps;
  var entity = blockProps.entity;

  var _entity$getData = entity.getData(),
      body = _entity$getData.body;

  return (0, _convertFromRaw2.default)(body);
}

function isExpanded(props) {
  var blockProps = props.blockProps;
  var entity = blockProps.entity;

  return !!entity.getData().show;
}

function getLocalChangeID(props) {
  var blockProps = props.blockProps;
  var entity = blockProps.entity;

  var data = entity.getData();
  return data ? data[LOCAL_CHANGE_ID] : null;
}

var DocsExpandable = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsExpandable, _React$PureComponent);

  function DocsExpandable() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsExpandable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsExpandable.__proto__ || (0, _getPrototypeOf2.default)(DocsExpandable)).call.apply(_ref, [this].concat(args))), _this), _this._activeEditor = null, _this._editor = null, _this._element = null, _this._labelEditorModal = null, _this._localChangeID = null, _this._timer = new _Timer2.default(), _this.state = {
      expanded: isExpanded(_this.props),
      localEditorState: getLocalEditorState(_this.props)
    }, _this._onElementRef = function (ref) {
      _this._unlisten();
      _this._element = ref;
      _this._listen();
    }, _this._onEditorRef = function (ref) {
      _this._editor = ref;
    }, _this._onEditorIn = function (event) {
      var editor = event.detail ? event.detail.editor : null;
      if (editor !== _this._editor) {
        // ignore nested editor.
        editor = null;
      }
      if (editor === _this._activeEditor) {
        return;
      }

      // Hack. Need to expose this to state immediately.
      _this._activeEditor = editor;
      _this.forceUpdate();
    }, _this._onEditorOut = function (event) {
      if (_this._activeEditor) {
        _this._activeEditor = null;
        _this.forceUpdate();
      }
    }, _this._onToggle = function (event) {
      event.preventDefault();
      _this.setState({ expanded: !_this.state.expanded }, _this._notifyChange);
    }, _this._onEditLabel = function (event) {
      event.preventDefault();
      console.log(event);

      var blockProps = _this.props.blockProps;
      var entity = blockProps.entity;

      var entityData = entity.getData();
      var expanded = _this.state.expanded;

      var title = expanded ? 'Change the label for "Show Less"' : 'Change the label for "Show More"';

      var label = expanded ? entityData.hideLabel || 'Show Less' : entityData.showLabel || 'Show More';
      _this._labelEditorModal = showLabelEditorModalDialog(title, label, _this._updateLabel);
    }, _this._updateLabel = function (label) {
      if (!_this._editor || !label) {
        // Unmounted.
        return;
      }
      var _this$props$blockProp = _this.props.blockProps,
          editorState = _this$props$blockProp.editorState,
          onChange = _this$props$blockProp.onChange,
          entity = _this$props$blockProp.entity,
          entityKey = _this$props$blockProp.entityKey;

      var entityData = entity.getData();
      var newEntityData = (0, _DocsExpandableModifiers.updateLabel)(entityData, label || '');
      var newEditorState = (0, _updateEntityData2.default)(editorState, entityKey, newEntityData);
      onChange(newEditorState);
    }, _this._getEditor = function () {
      return _this._activeEditor;
    }, _this._onChange = function (localEditorState) {
      if (!_this.context.docsContext.canEdit) {
        return;
      }
      // Effectively and optimistically commit change locally then sync later.
      _this.setState({ localEditorState: localEditorState }, _this._notifyChange);
    }, _this._notifyChange = function () {
      if (!_this.context.docsContext.canEdit) {
        return;
      }
      _this._timer.clear();
      _this._timer.set(_this._notifyChangeImmediate, 250);
    }, _this._notifyChangeImmediate = function () {
      _this._timer.clear();
      if (!_this._editor) {
        // Unmounted.
        return;
      }
      var localEditorState = _this.state.localEditorState;
      var _this$props$blockProp2 = _this.props.blockProps,
          editorState = _this$props$blockProp2.editorState,
          onChange = _this$props$blockProp2.onChange,
          entity = _this$props$blockProp2.entity,
          entityKey = _this$props$blockProp2.entityKey;

      var entityData = entity.getData();
      var localChangeID = (0, _uniqueID2.default)();
      var newEntityData = (0, _extends4.default)({}, entityData, (0, _defineProperty3.default)({
        body: (0, _convertToRaw2.default)(localEditorState),
        show: _this.state.expanded
      }, LOCAL_CHANGE_ID, localChangeID));
      var newEditorState = (0, _updateEntityData2.default)(editorState, entityKey, newEntityData);
      _this._localChangeID = localChangeID;
      onChange(newEditorState);
    }, _this._autoFocus = function () {
      _this._editor && _this._editor.focus();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsExpandable, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // Sync local editor state.
      var id = getLocalChangeID(nextProps);
      if (id !== this._localChangeID) {
        this._localChangeID = id;
        this._timer.clear();
        this.setState({
          expanded: isExpanded(nextProps),
          localEditorState: getLocalEditorState(nextProps)
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unlisten();
      this._labelEditorModal && this._labelEditorModal.dispose();
      this._timer.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      var canEdit = this.context.docsContext.canEdit;
      var _state = this.state,
          localEditorState = _state.localEditorState,
          expanded = _state.expanded;
      var blockProps = this.props.blockProps;
      var entity = blockProps.entity;

      var activeEditor = this._activeEditor;
      var data = entity.getData();

      var editorID = activeEditor ? activeEditor.id : null;
      var className = (0, _classnames2.default)({
        'docs-expandable-main': true,
        'docs-expandable-active': !!editorID,
        'docs-expandable-expanded': expanded
      });
      var showLabel = expanded ? data.hideLabel || 'Show Less' : data.showLabel || 'Show More';

      var placeholder = canEdit ? 'type something' : '';
      var editLabel = canEdit ? _react2.default.createElement(_DocsIcon2.default, {
        className: 'docs-expandable-toggle-icon',
        icon: 'create',
        onClick: this._onEditLabel
      }) : null;

      var attrs = (0, _defineProperty3.default)({}, _DocsDataAttributes2.default.EDITOR_FOR, editorID);
      var toggleAttrs = (0, _defineProperty3.default)({}, _DocsDataAttributes2.default.TOOL, true);

      return _react2.default.createElement(
        'div',
        (0, _extends4.default)({}, attrs, {
          className: className,
          contentEditable: false,
          ref: this._onElementRef }),
        _react2.default.createElement(
          'span',
          (0, _extends4.default)({}, toggleAttrs, {
            className: 'docs-expandable-toggle',
            onClick: this._onToggle }),
          showLabel
        ),
        editLabel,
        _react2.default.createElement(
          'div',
          { className: 'docs-expandable-body' },
          _react2.default.createElement(_DocsBaseEditor2.default, {
            editorState: localEditorState,
            id: editorID,
            onChange: this._onChange,
            placeholder: placeholder,
            ref: this._onEditorRef
          })
        )
      );
    }
  }, {
    key: '_listen',
    value: function _listen() {
      if (!this.context.docsContext.canEdit) {
        return;
      }
      var node = this._element ? _reactDom2.default.findDOMNode(this._element) : null;
      if (node) {
        node.addEventListener(_DocsEventTypes2.default.EDITOR_IN, this._onEditorIn, false);
        node.addEventListener(_DocsEventTypes2.default.EDITOR_OUT, this._onEditorOut, true);
        this._nodeListening = node;
      }
    }
  }, {
    key: '_unlisten',
    value: function _unlisten() {
      if (!this._nodeListening) {
        return;
      }
      var node = this._nodeListening;
      this._nodeListening = null;
      if (node) {
        node.removeEventListener(_DocsEventTypes2.default.EDITOR_IN, this._onEditorIn, false);
        node.removeEventListener(_DocsEventTypes2.default.EDITOR_OUT, this._onEditorOut, true);
      }
    }
  }]);
  return DocsExpandable;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsExpandable);
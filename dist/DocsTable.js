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

var _DocsTableModifiers = require('./DocsTableModifiers');

var _DocsTableModifiers2 = _interopRequireDefault(_DocsTableModifiers);

var _DocsTableRow = require('./DocsTableRow');

var _DocsTableRow2 = _interopRequireDefault(_DocsTableRow);

var _DocsTableToolbar = require('./DocsTableToolbar');

var _DocsTableToolbar2 = _interopRequireDefault(_DocsTableToolbar);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _withDocsContext = require('./withDocsContext');

var _withDocsContext2 = _interopRequireDefault(_withDocsContext);

var _draftJs = require('draft-js');

require('./DocsTable.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_DocsEditorLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorLike || require('prop-types').any;

var DocsTableEntityDataKeys = _DocsTableModifiers2.default.DocsTableEntityDataKeys;

var DocsTable = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsTable, _React$PureComponent);

  function DocsTable() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DocsTable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DocsTable.__proto__ || (0, _getPrototypeOf2.default)(DocsTable)).call.apply(_ref, [this].concat(args))), _this), _this._activeEditor = null, _this._element = null, _this._table = null, _this._onElementRef = function (ref) {
      _this._unlisten();
      _this._element = ref;
      _this._listen();
    }, _this._onTableRef = function (ref) {
      _this._table = ref;
    }, _this._onEditorIn = function (event) {
      var editor = event.detail ? event.detail.editor : null;

      if (editor) {
        var _editor$props = editor.props,
            rowIndex = _editor$props.rowIndex,
            cellIndex = _editor$props.cellIndex;

        if (isNaN(rowIndex) || isNaN(cellIndex)) {
          // from a non-celll editor.
          editor = null;
        }
      }

      if (editor !== null) {
        var target = event.target;

        var tableNode = _this._table ? _reactDom2.default.findDOMNode(_this._table) : null;
        if (tableNode) {
          var node = target;
          while (node) {
            if (node.nodeType === 1 && node.getAttribute(_DocsDataAttributes2.default.TABLE)) {
              if (node !== tableNode) {
                // Editor came from a nested table's editor.
                editor = null;
              }
              break;
            }
            node = node.parentElement;
          }
        } else {
          editor = null;
        }
      }

      // Hack. Need to expose this to state immediately.
      if (editor !== _this._activeEditor) {
        _this._activeEditor = editor;
        _this.forceUpdate();
      }
    }, _this._onEditorOut = function (event) {
      if (_this._activeEditor) {
        _this._activeEditor = null;
        _this.forceUpdate();
      }
    }, _this._getEditor = function () {
      return _this._activeEditor;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DocsTable, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unlisten();
    }
  }, {
    key: 'render',
    value: function render() {
      var _tableAttrs;

      var blockProps = this.props.blockProps;
      var entity = blockProps.entity,
          editorState = blockProps.editorState,
          onChange = blockProps.onChange,
          entityKey = blockProps.entityKey;

      var entityData = entity.getData();
      var colsCount = entityData.colsCount,
          rowsCount = entityData.rowsCount;

      var activeEditor = this._activeEditor;

      var editorRowIndex = -1;
      var editorCellIndex = -1;
      if (activeEditor) {
        var editorProps = activeEditor.props;
        editorRowIndex = editorProps.rowIndex;
        editorCellIndex = editorProps.cellIndex;
      }

      var rows = [];

      var rr = 0;
      // TODO: resizable should be checked with whether user has permission to do
      // so.
      while (rr < rowsCount) {
        rows.push(_react2.default.createElement(_DocsTableRow2.default, {
          editorCellIndex: editorCellIndex,
          editorRowIndex: editorRowIndex,
          editorState: editorState,
          entity: entity,
          entityKey: entityKey,
          key: 'row_' + rr,
          onChange: onChange,
          resizable: true,
          rowIndex: rr
        }));
        rr++;
      }
      var editorID = activeEditor ? activeEditor.id : null;
      var className = (0, _classnames2.default)({
        'docs-table-main': true,
        'docs-table-main-active': !!editorID,
        'docs-table-main-no-borders': entityData[DocsTableEntityDataKeys.NO_BORDERS]
      });
      var attrs = (0, _defineProperty3.default)({}, _DocsDataAttributes2.default.EDITOR_FOR, editorID);
      var tableAttrs = (_tableAttrs = {}, (0, _defineProperty3.default)(_tableAttrs, _DocsDataAttributes2.default.ELEMENT, true), (0, _defineProperty3.default)(_tableAttrs, _DocsDataAttributes2.default.TABLE, true), _tableAttrs);

      var resizePlaceholderCells = new Array(colsCount).fill(0).map(function (_, ii) {
        return _react2.default.createElement('td', {
          className: 'docs-table-resize-placeholder-cell',
          key: 'resize_' + ii
        });
      });
      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({}, attrs, {
          className: className,
          contentEditable: false,
          ref: this._onElementRef }),
        _react2.default.createElement(_DocsTableToolbar2.default, {
          editor: activeEditor,
          editorState: editorState,
          entity: entity,
          entityKey: entityKey,
          getEditor: this._getEditor,
          onChange: onChange
        }),
        _react2.default.createElement(
          'table',
          (0, _extends3.default)({}, tableAttrs, {
            className: 'docs-table',
            ref: this._onTableRef }),
          _react2.default.createElement(
            'tbody',
            {
              'aria-hidden': 'true',
              className: 'docs-table-resize-placeholder-footer' },
            _react2.default.createElement(
              'tr',
              { className: 'docs-table-resize-placeholder-row' },
              resizePlaceholderCells
            )
          ),
          _react2.default.createElement(
            'tbody',
            { className: 'docs-table-body' },
            rows
          )
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
  return DocsTable;
}(_react2.default.PureComponent);

module.exports = (0, _withDocsContext2.default)(DocsTable);
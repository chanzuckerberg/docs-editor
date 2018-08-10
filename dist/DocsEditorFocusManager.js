'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _DocsEventTypes = require('./DocsEventTypes');

var _DocsEventTypes2 = _interopRequireDefault(_DocsEventTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _captureDocumentEvents = require('./captureDocumentEvents');

var _captureDocumentEvents2 = _interopRequireDefault(_captureDocumentEvents);

var _createDOMCustomEvent = require('./createDOMCustomEvent');

var _createDOMCustomEvent2 = _interopRequireDefault(_createDOMCustomEvent);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _nullthrows3 = require('nullthrows');

var _nullthrows4 = _interopRequireDefault(_nullthrows3);

var _tryBlur = require('./tryBlur');

var _tryBlur2 = _interopRequireDefault(_tryBlur);

var _tryFindDOMNode = require('./tryFindDOMNode');

var _tryFindDOMNode2 = _interopRequireDefault(_tryFindDOMNode);

var _tryFocus = require('./tryFocus');

var _tryFocus2 = _interopRequireDefault(_tryFocus);

var _DocsModifiers = require('./DocsModifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// How long do we wait until starting transitioning focus from one editor to
// another.
var babelPluginFlowReactPropTypes_proptype_DocsEditorLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsEditorLike || require('prop-types').any;

var FOCUS_TRANSITION_DELAY_MS = 1;
// How long do we expect the focus transition should take.
var FOCUS_TRANSITION_DURATION_MS = 100;

function getEditorByElement(editors, element) {
  var elementToEditor = new _map2.default();
  editors.forEach(function (component) {
    var node = (0, _tryFindDOMNode2.default)(component);
    if (node) {
      elementToEditor.set(node, component);
    }
  });

  while (element && element.nodeType === 1) {
    var id = element.getAttribute(_DocsDataAttributes2.default.EDITOR_FOR);
    if (id) {
      var editorNode = document.getElementById(id);
      if (elementToEditor.has(editorNode)) {
        return elementToEditor.get(editorNode);
      }
    }
    if (elementToEditor.has(element)) {
      return elementToEditor.get(element);
    }
    element = element.parentElement;
  }
  return null;
}

var EDITOR_IN = _DocsEventTypes2.default.EDITOR_IN,
    EDITOR_OUT = _DocsEventTypes2.default.EDITOR_OUT,
    EDITOR_REQUEST_UPDATE_ENTITY_DATA = _DocsEventTypes2.default.EDITOR_REQUEST_UPDATE_ENTITY_DATA;

var DocsEditorFocusManager = function () {
  function DocsEditorFocusManager() {
    var _this = this;

    (0, _classCallCheck3.default)(this, DocsEditorFocusManager);
    this._editorsSet = new _set2.default();
    this._editorsMap = new _map2.default();
    this._eventsCapture = null;
    this._activeEditor = null;
    this._timer = new _Timer2.default();

    this._onEditorRequestUpdateEntityData = function (e) {
      var detail = e.detail,
          target = e.target;
      var id = target.id;

      var editor = _this._editorsMap.get(id);
      if (!editor) {
        return;
      }

      var _nullthrows = (0, _nullthrows4.default)(detail),
          entityKey = _nullthrows.entityKey,
          entityData = _nullthrows.entityData;

      var _nullthrows2 = (0, _nullthrows4.default)(editor.props),
          onChange = _nullthrows2.onChange,
          editorState = _nullthrows2.editorState;

      onChange((0, _DocsModifiers.updateEntityData)(editorState, entityKey, entityData));
    };

    this._onMouseDown = function (e) {
      var target = e.target;

      if (_this._maybeTransferFocus(target)) {
        e.preventDefault();
      }
    };

    this._maybeTransferFocus = function (target) {
      _this._timer.clear();

      var activeEditor = _this._activeEditor;

      var node = target;
      while (node) {
        if (node.nodeType === 1) {
          if (node.getAttribute(_DocsDataAttributes2.default.TOOL)) {
            // Do not transfer editor's focus if event happened within a
            // tool that is used to assist the current editor.
            return false;
          }

          if (node.getAttribute(_DocsDataAttributes2.default.WIDGET)) {
            // It's a widget (e.g DocsExpandable), just move focus to it.
            if (activeEditor) {
              _this._activeEditor = null;
              _this._blurEditor(activeEditor);
            }
            _this._timer.set(function () {
              var _document = document,
                  activeElement = _document.activeElement,
                  documentElement = _document.documentElement;

              if (!documentElement || !documentElement.contains(node) || node === activeElement || node.contains(activeElement)) {
                // node is already focused.
                return;
              }
              (0, _tryFocus2.default)(node);
            }, FOCUS_TRANSITION_DELAY_MS);

            var _document2 = document,
                activeElement = _document2.activeElement;

            return activeElement ? activeElement !== node && !node.contains(activeElement) : true;
          }
        }
        node = node.parentElement;
      }

      _this._activeEditor = null;

      var editor = getEditorByElement(_this._editorsSet, target);
      if (!editor) {
        activeEditor && _this._blurEditor(activeEditor);
        return false;
      }

      if (activeEditor && activeEditor !== editor) {
        _this._blurEditor(activeEditor);
      }

      if (activeEditor && activeEditor === editor) {
        _this._activeEditor = editor;
        return;
      }

      _this._activeEditor = editor;

      if (editor) {
        _this._timer.set(function () {
          var root = document.documentElement;
          if (root && _this._activeEditor === editor && root.contains(target)) {
            _this._focusEditor(editor, target);
          }
        }, FOCUS_TRANSITION_DELAY_MS);
      }
      return !!editor;
    };

    this._eventsCapture = (0, _captureDocumentEvents2.default)((0, _defineProperty3.default)({
      mousedown: this._onMouseDown
    }, EDITOR_REQUEST_UPDATE_ENTITY_DATA, this._onEditorRequestUpdateEntityData));
  }

  (0, _createClass3.default)(DocsEditorFocusManager, [{
    key: 'register',
    value: function register(id, editor) {
      (0, _invariant2.default)(!this._editorsMap.has(id), 'already registered');
      (0, _invariant2.default)(!this._editorsSet.has(editor), 'already registered');
      this._editorsSet.add(editor);
      this._editorsMap.set(id, editor);
    }
  }, {
    key: 'unregister',
    value: function unregister(id, editor) {
      (0, _invariant2.default)(this._editorsMap.get(id) === editor, 'not registered');
      (0, _invariant2.default)(this._editorsSet.has(editor), 'not registered');
      this._editorsSet.delete(editor);
      this._editorsMap.delete(id);
    }
  }, {
    key: '_blurEditor',
    value: function _blurEditor(editor) {
      if (!this._editorsSet.has(editor)) {
        return;
      }
      var node = _reactDom2.default.findDOMNode(editor);
      if (!node) {
        return;
      }
      (0, _tryBlur2.default)(editor);
      var detail = { editor: editor };
      var event = (0, _createDOMCustomEvent2.default)(EDITOR_OUT, true, true, detail);
      node.dispatchEvent(event);
    }
  }, {
    key: '_focusEditor',
    value: function _focusEditor(editor, target) {
      if (!this._editorsSet.has(editor)) {
        return;
      }
      var detail = { editor: editor };
      var event = (0, _createDOMCustomEvent2.default)(EDITOR_IN, true, true, detail);
      var node = _reactDom2.default.findDOMNode(editor);
      if (!node) {
        return;
      }

      var currentNode = target;
      var scrollableNodes = new _map2.default();
      // Record scrolltop which may change when focus changes.
      while (currentNode && currentNode.nodeType === 1) {
        var _currentNode = currentNode,
            scrollTop = _currentNode.scrollTop;

        if (scrollTop) {
          scrollableNodes.set(currentNode, scrollTop);
        }
        currentNode = currentNode.parentElement;
      }

      (0, _tryFocus2.default)(editor);
      node.dispatchEvent(event);

      // Resume scrolltop.
      scrollableNodes.forEach(function (y, currentNode) {
        currentNode.scrollTop = y;
      });
    }
  }]);
  return DocsEditorFocusManager;
}();

DocsEditorFocusManager.FOCUS_TRANSITION_DURATION_MS = FOCUS_TRANSITION_DURATION_MS;


module.exports = DocsEditorFocusManager;
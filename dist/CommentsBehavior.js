'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractBehavior2 = require('./AbstractBehavior');

var _AbstractBehavior3 = _interopRequireDefault(_AbstractBehavior2);

var _DocsActionTypes = require('./DocsActionTypes');

var _DocsActionTypes2 = _interopRequireDefault(_DocsActionTypes);

var _DocsBlockTypes = require('./DocsBlockTypes');

var _DocsBlockTypes2 = _interopRequireDefault(_DocsBlockTypes);

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _DocsDecoratorTypes = require('./DocsDecoratorTypes');

var _DocsDecoratorTypes2 = _interopRequireDefault(_DocsDecoratorTypes);

var _getCurrentSelectionEntity = require('./getCurrentSelectionEntity');

var _getCurrentSelectionEntity2 = _interopRequireDefault(_getCurrentSelectionEntity);

var _hasSelection = require('./hasSelection');

var _hasSelection2 = _interopRequireDefault(_hasSelection);

var _returnFalse = require('./returnFalse');

var _returnFalse2 = _interopRequireDefault(_returnFalse);

var _returnTrue = require('./returnTrue');

var _returnTrue2 = _interopRequireDefault(_returnTrue);

var _uniqueID = require('./uniqueID');

var _uniqueID2 = _interopRequireDefault(_uniqueID);

var _DocsEditorChangeType = require('./DocsEditorChangeType');

var _draftJs = require('draft-js');

var _DocsModifiers = require('./DocsModifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ModalHandle = require('./showModalDialog').babelPluginFlowReactPropTypes_proptype_ModalHandle || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_OnChange = require('./AbstractBehavior').babelPluginFlowReactPropTypes_proptype_OnChange || require('prop-types').any;

function getEntity(editorState) {
  var entity = (0, _getCurrentSelectionEntity2.default)(editorState);
  return entity && entity.getType() === _DocsDecoratorTypes2.default.DOCS_COMMENT ? entity : null;
}

function addComment(editorState, commentThreadId) {
  var selection = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  var contentStateWithEntity = contentState.createEntity(_DocsDecoratorTypes2.default.DOCS_COMMENT, 'MUTABLE', {
    commentThreadId: commentThreadId
  });
  var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  var newContentState = _draftJs.Modifier.applyEntity(contentStateWithEntity, selection, entityKey);
  return _draftJs.EditorState.push(editorState, newContentState, _DocsEditorChangeType.APPLY_ENTITY);
}

function currentBlockContainsComment(editorState) {
  var selection = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  var entityMap = contentState.getEntityMap();
  return contentState.getBlockForKey(selection.getAnchorKey()).getCharacterList().slice(selection.getStartOffset(), selection.getEndOffset()).some(function (v) {
    var entityKey = v.getEntity();
    if (entityKey) {
      var entity = contentState.getEntity(entityKey);
      return entity.getType() === _DocsDecoratorTypes2.default.DOCS_COMMENT;
    } else {
      return false;
    }
  });
}

var CommentsBehavior = function (_AbstractBehavior) {
  (0, _inherits3.default)(CommentsBehavior, _AbstractBehavior);

  function CommentsBehavior() {
    (0, _classCallCheck3.default)(this, CommentsBehavior);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CommentsBehavior.__proto__ || (0, _getPrototypeOf2.default)(CommentsBehavior)).call(this, {
      action: _DocsActionTypes2.default.COMMENT_ADD,
      icon: 'comment',
      label: 'Add Comment'
    }));

    _this.isEnabled = function (editorState) {
      return (0, _hasSelection2.default)(editorState) && !currentBlockContainsComment(editorState);
    };

    _this.isActive = function (editorState) {
      return false;
    };

    _this.execute = function (editorState, onChange, docsContext) {
      var selection = editorState.getSelection();
      if (selection.isCollapsed() || currentBlockContainsComment(editorState)) {
        return null;
      }

      var commentThreadId = docsContext.runtime && docsContext.runtime.createCommentThreadID && docsContext.runtime.createCommentThreadID();

      commentThreadId && onChange(addComment(editorState, commentThreadId));
    };

    return _this;
  }

  return CommentsBehavior;
}(_AbstractBehavior3.default);

exports.default = CommentsBehavior;
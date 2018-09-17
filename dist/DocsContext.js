'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _DocsActionTypes = require('./DocsActionTypes');

var _DocsActionTypes2 = _interopRequireDefault(_DocsActionTypes);

var _DocsEditorRuntime = require('./DocsEditorRuntime');

var _DocsEditorRuntime2 = _interopRequireDefault(_DocsEditorRuntime);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ALL_ACTIONS = (0, _immutable.Set)((0, _keys2.default)(_DocsActionTypes2.default));

var RecordDefaultData = {
  allowedActions: ALL_ACTIONS,
  canEdit: false,
  id: '',
  runtime: null
};

var DocsContext = function (_Record) {
  (0, _inherits3.default)(DocsContext, _Record);

  function DocsContext(data) {
    var _this;

    (0, _classCallCheck3.default)(this, DocsContext);
    var id = data.id,
        allowedActions = data.allowedActions,
        canEdit = data.canEdit,
        runtime = data.runtime;

    id = id || '';

    if (!_immutable.Set.isSet(allowedActions)) {
      if (Array.isArray(allowedActions)) {
        allowedActions = (0, _immutable.Set)(allowedActions);
      } else if (!allowedActions) {
        allowedActions = ALL_ACTIONS;
      } else {
        (0, _invariant2.default)(false, 'invalid allowedActions %s', allowedActions);
      }
    }

    canEdit = !!canEdit;
    runtime = runtime || null, (_this = (0, _possibleConstructorReturn3.default)(this, (DocsContext.__proto__ || (0, _getPrototypeOf2.default)(DocsContext)).call(this, {
      id: id,
      canEdit: canEdit,
      allowedActions: allowedActions,
      runtime: runtime
    })), _this);
    return _this;
  }

  return DocsContext;
}((0, _immutable.Record)(RecordDefaultData));

module.exports = DocsContext;
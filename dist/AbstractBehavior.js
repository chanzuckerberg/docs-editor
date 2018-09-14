'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _DocsActionTypes = require('./DocsActionTypes');

var _DocsActionTypes2 = _interopRequireDefault(_DocsActionTypes);

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_ModalHandle = require('./showModalDialog').babelPluginFlowReactPropTypes_proptype_ModalHandle || require('prop-types').any;

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_Config', {
  value: require('prop-types').shape({
    action: require('prop-types').string.isRequired,
    icon: require('prop-types').string,
    label: require('prop-types').string.isRequired
  })
});

var AbstractBehavior = function AbstractBehavior(config) {
  var _this = this;

  (0, _classCallCheck3.default)(this, AbstractBehavior);

  this.isActive = function (e) {
    return false;
  };

  this.isEnabled = function (e) {
    return false;
  };

  this.update = function (e, o, d) {
    return _this.execute(e, o, d);
  };

  this.execute = function (e, o, d) {
    console.log('not supported');
    return null;
  };

  (0, _assign2.default)(this, config);
};

function noop(editorState, onChange, docsContext) {
  console.log('not supported');
}

exports.default = AbstractBehavior;
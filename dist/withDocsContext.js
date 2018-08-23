'use strict';

var _DocsContext = require('./DocsContext');

var _DocsContext2 = _interopRequireDefault(_DocsContext);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function withDocsContext(Component) {

  (0, _invariant2.default)(!Component.contextTypes && !Component.prototype.getChildContext, 'Component already has contextTypes');

  Component.contextTypes = {
    docsContext: _propTypes2.default.instanceOf(_DocsContext2.default)
  };

  Component.childContextTypes = {
    docsContext: _propTypes2.default.instanceOf(_DocsContext2.default)
  };

  Component.prototype.getChildContext = function getChildContext() {
    var docsContext = this.context.docsContext || this.props.docsContext;
    (0, _invariant2.default)(!!docsContext, 'docsContext is not provided');
    return {
      docsContext: docsContext
    };
  };
  return Component;
}

module.exports = withDocsContext;
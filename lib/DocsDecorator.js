'use strict';

var _DocsDecoratorEntityDataContainer = require('./DocsDecoratorEntityDataContainer');

var _DocsDecoratorEntityDataContainer2 = _interopRequireDefault(_DocsDecoratorEntityDataContainer);

var _draftJs = require('draft-js');

var _DocsHelpers = require('./DocsHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entries = [];

module.exports = {

  // https://draftjs.org/docs/advanced-topics-decorators.html#compositedecorator
  register: function register(decoratorType, Component) {
    var strategy = _DocsHelpers.findEntitiesForType.bind(null, decoratorType);
    var fn = _DocsDecoratorEntityDataContainer2.default;
    entries.push({
      strategy: strategy,
      component: fn.bind(null, Component, decoratorType)
    });
  },
  get: function get() {
    return new _draftJs.CompositeDecorator(entries);
  }
};
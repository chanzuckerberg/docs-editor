'use strict';

var _DocsDecoratorEntityDataContainer = require('./DocsDecoratorEntityDataContainer');

var _DocsDecoratorEntityDataContainer2 = _interopRequireDefault(_DocsDecoratorEntityDataContainer);

var _findEntitiesForType = require('./findEntitiesForType');

var _findEntitiesForType2 = _interopRequireDefault(_findEntitiesForType);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entries = [];

module.exports = {

  // https://draftjs.org/docs/advanced-topics-decorators.html#compositedecorator
  register: function register(decoratorType, Component) {
    var strategy = _findEntitiesForType2.default.bind(null, decoratorType);
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
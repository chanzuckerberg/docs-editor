'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Type Component properly.

function getComponentByElement(components, element) {
  var elementToComponent = new _map2.default();
  components.forEach(function (component) {
    var node = _reactDom2.default.findDOMNode(component);
    if (node) {
      elementToComponent.set(node, component);
    }
  });

  while (element && element.nodeType === 1) {
    if (elementToComponent.has(element)) {
      return elementToComponent.get(element);
    }
    element = element.parentElement;
  }
  return null;
}

exports.default = getComponentByElement;
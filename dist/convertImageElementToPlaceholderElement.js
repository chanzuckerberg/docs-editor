'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _DocsDataAttributes = require('./DocsDataAttributes');

var _DocsDataAttributes2 = _interopRequireDefault(_DocsDataAttributes);

var _DocsDecoratorTypes = require('./DocsDecoratorTypes');

var _DocsDecoratorTypes2 = _interopRequireDefault(_DocsDecoratorTypes);

var _asElement = require('./asElement');

var _asElement2 = _interopRequireDefault(_asElement);

var _getElementAlignment = require('./getElementAlignment');

var _getElementAlignment2 = _interopRequireDefault(_getElementAlignment);

var _getElementDimension = require('./getElementDimension');

var _getElementDimension2 = _interopRequireDefault(_getElementDimension);

var _DocsCharacter = require('./DocsCharacter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Note that this function has side-effect!
// img does not have characters data, thus DraftJS wo't be able to
// parse its entity data. The workaround is to replace it with an
// empty element that can be converted to DocsImage later.
var babelPluginFlowReactPropTypes_proptype_DocsImageEntityData = require('./Types').babelPluginFlowReactPropTypes_proptype_DocsImageEntityData || require('prop-types').any;

function convertImageElementToPlaceholderElement(img) {
  var parentNode = img.parentNode,
      src = img.src;

  if (!parentNode || !src) {
    return;
  }

  var imgEl = (0, _asElement2.default)(img);

  if (imgEl.getAttribute(_DocsDataAttributes2.default.ELEMENT)) {
    // The image is rendered by <DocsSafeImage /> which contains its meta
    // data at its containing <span /> element. We can skip this <img />
    // element.
    parentNode.removeChild(img);
    return;
  }

  var doc = img.ownerDocument;
  var node = doc.createElement('ins');

  var entityData = {
    url: src,
    align: (0, _getElementAlignment2.default)(imgEl),
    height: (0, _getElementDimension2.default)(imgEl, 'height'),
    width: (0, _getElementDimension2.default)(imgEl, 'width')
  };

  var decoratorData = {
    type: _DocsDecoratorTypes2.default.DOCS_IMAGE,
    mutability: 'IMMUTABLE',
    data: entityData
  };

  node.setAttribute(_DocsDataAttributes2.default.DECORATOR_DATA, (0, _stringify2.default)(decoratorData));
  node.setAttribute(_DocsDataAttributes2.default.DECORATOR_TYPE, _DocsDecoratorTypes2.default.DOCS_IMAGE);
  node.innerHTML = _DocsCharacter.CHAR_ZERO_WIDTH;
  parentNode.insertBefore(node, img);
  parentNode.removeChild(img);
}

exports.default = convertImageElementToPlaceholderElement;
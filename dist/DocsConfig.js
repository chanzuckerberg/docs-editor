'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _DocsAnnotation = require('./DocsAnnotation');

var _DocsAnnotation2 = _interopRequireDefault(_DocsAnnotation);

var _DocsBlockTypeToComponent = require('./DocsBlockTypeToComponent');

var _DocsBlockTypeToComponent2 = _interopRequireDefault(_DocsBlockTypeToComponent);

var _DocsBlockTypes = require('./DocsBlockTypes');

var _DocsBlockTypes2 = _interopRequireDefault(_DocsBlockTypes);

var _DocsDecorator = require('./DocsDecorator');

var _DocsDecorator2 = _interopRequireDefault(_DocsDecorator);

var _DocsDecoratorTypes = require('./DocsDecoratorTypes');

var _DocsDecoratorTypes2 = _interopRequireDefault(_DocsDecoratorTypes);

var _DocsExpandable = require('./DocsExpandable');

var _DocsExpandable2 = _interopRequireDefault(_DocsExpandable);

var _DocsImage = require('./DocsImage');

var _DocsImage2 = _interopRequireDefault(_DocsImage);

var _DocsLink = require('./DocsLink');

var _DocsLink2 = _interopRequireDefault(_DocsLink);

var _DocsMath = require('./DocsMath');

var _DocsMath2 = _interopRequireDefault(_DocsMath);

var _DocsTable = require('./DocsTable');

var _DocsTable2 = _interopRequireDefault(_DocsTable);

var _DocsCalculator = require('./DocsCalculator');

var _DocsCalculator2 = _interopRequireDefault(_DocsCalculator);

var _DocsComment = require('./DocsComment');

var _DocsComment2 = _interopRequireDefault(_DocsComment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerCustomBlocks(specs) {
  specs.forEach(function (spec) {
    var _spec = (0, _slicedToArray3.default)(spec, 2),
        type = _spec[0],
        view = _spec[1];

    _DocsBlockTypeToComponent2.default.register(type, view);
  });
}

function registerDecorator(specs) {
  specs.forEach(function (spec) {
    var _spec2 = (0, _slicedToArray3.default)(spec, 2),
        type = _spec2[0],
        view = _spec2[1];

    _DocsDecorator2.default.register(type, view);
  });
}

function init() {
  registerCustomBlocks([[_DocsBlockTypes2.default.DOCS_CALCULATOR, _DocsCalculator2.default], [_DocsBlockTypes2.default.DOCS_EXPANDABLE, _DocsExpandable2.default], [_DocsBlockTypes2.default.DOCS_TABLE, _DocsTable2.default]]);

  // Register Decorator
  registerDecorator([[_DocsDecoratorTypes2.default.DOCS_ANNOTATION, _DocsAnnotation2.default], [_DocsDecoratorTypes2.default.DOCS_COMMENT, _DocsComment2.default], [_DocsDecoratorTypes2.default.DOCS_IMAGE, _DocsImage2.default], [_DocsDecoratorTypes2.default.DOCS_MATH, _DocsMath2.default], [_DocsDecoratorTypes2.default.LINK, _DocsLink2.default]]);
}

module.exports = {
  init: init
};
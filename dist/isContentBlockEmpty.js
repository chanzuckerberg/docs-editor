'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isContentBlockEmpty;

var _draftJs = require('draft-js');

function isContentBlockEmpty(contentBlock) {
  return contentBlock.getType() === 'unstyled' && contentBlock.getText() === '' && contentBlock.getDepth() === 0 && contentBlock.getData() && contentBlock.getData().get('className') === undefined;
}
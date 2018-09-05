'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


// Forked from https://github.com/facebook/draft-js/blob/master/src/model/immutable/EditorChangeType.js

var ADJUST_DEPTH = exports.ADJUST_DEPTH = 'adjust-depth';
var APPLY_ENTITY = exports.APPLY_ENTITY = 'apply-entity';
var BACKSPACE_CHARACTER = exports.BACKSPACE_CHARACTER = 'backspace-character';
var CHANGE_BLOCK_DATA = exports.CHANGE_BLOCK_DATA = 'change-block-data';
var CHANGE_BLOCK_TYPE = exports.CHANGE_BLOCK_TYPE = 'change-block-type';
var CHANGE_INLINE_STYLE = exports.CHANGE_INLINE_STYLE = 'change-inline-style';
var MOVE_BLOCK = exports.MOVE_BLOCK = 'move-block';
var DELETE_CHARACTER = exports.DELETE_CHARACTER = 'delete-character';
var INSERT_CHARACTERS = exports.INSERT_CHARACTERS = 'insert-characters';
var INSERT_FRAGMENT = exports.INSERT_FRAGMENT = 'insert-fragment';
var REDO = exports.REDO = 'redo';
var REMOVE_RANGE = exports.REMOVE_RANGE = 'remove-range';
var SPELLCHECK_CHANGE = exports.SPELLCHECK_CHANGE = 'spellcheck-change';
var SPLIT_BLOCK = exports.SPLIT_BLOCK = 'split-block';
var UNDO = exports.UNDO = 'undo';
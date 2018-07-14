"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toggleExpandable(entityData) {
  return (0, _extends3.default)({}, entityData, {
    show: !entityData.show
  });
}

function updateLabel(entityData, label) {
  var newEntityData = (0, _extends3.default)({}, entityData);
  if (newEntityData.show) {
    newEntityData.hideLabel = label;
  } else {
    newEntityData.showLabel = label;
  }
  return newEntityData;
}

module.exports = {
  updateLabel: updateLabel,
  toggleExpandable: toggleExpandable
};
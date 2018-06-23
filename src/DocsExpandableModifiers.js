// @flow

type ExpandableEntityData = {
  body: string,
  show: boolean,
  showLabel: string,
  hideLabel: string,
};

function toggleExpandable(entityData: ExpandableEntityData): ExpandableEntityData {
  return {
    ...entityData,
    show: !entityData.show,
  };
}

function updateLabel(
  entityData: ExpandableEntityData,
  label: string,
): ExpandableEntityData {
  const newEntityData = {
    ...entityData,
  };
  if (newEntityData.show) {
    newEntityData.hideLabel = label;
  } else {
    newEntityData.showLabel = label;
  }
  return newEntityData;
}

module.exports = {
  updateLabel,
  toggleExpandable,
};

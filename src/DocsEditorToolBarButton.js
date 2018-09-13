// @flow

import DocsButton from './DocsButton';
import React from 'react';
import {EditorState} from 'draft-js';

import type {DocsEditorLike} from './Types';
import type {EditorToolbarFeature} from './DocsEditorToolBarFeatures';

type Props = {
  active: boolean,
  disabled: boolean,
  feature: EditorToolbarFeature,
  id?: ?string,
  onClick: (feature: EditorToolbarFeature) => void,
};

class DocsEditorToolBarButton extends React.PureComponent {

  props: Props;

  render(): React.Element<any> {
    const {feature, onClick, id, active, disabled} = this.props;
    const {label, icon} = feature;

    return (
      <DocsButton
        active={active}
        disabled={disabled}
        icon={feature.icon}
        id={id}
        label={label}
        onClick={onClick}
        value={feature}
      />
    );
  }
}

module.exports = DocsEditorToolBarButton;

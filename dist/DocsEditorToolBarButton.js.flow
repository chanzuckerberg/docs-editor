// @flow

import DocsButton from './DocsButton';
import React from 'react';
import {EditorState} from 'draft-js';

import type {DocsEditorLike} from './Types';
import type {DocsBehavior} from './DocsBehaviors';

type Props = {
  active: boolean,
  disabled: boolean,
  feature: DocsBehavior,
  id?: ?string,
  onClick: (feature: DocsBehavior) => void,
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

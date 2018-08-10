// @flow

import React from 'react';
import DocsButton from './DocsButton';

export type Spec = {
  action: string,
  icon?: string,
  label: string,
  modifier?: Function,
  style?: string,
};

type Props = {
  active?: ?boolean,
  disabled: boolean,
  id?: ?string,
  onClick: (s: Spec) => void,
  spec: Spec,
};

class DocsEditorToolBarButton extends React.PureComponent {

  props: Props;

  render(): React.Element<any> {
    const {id, disabled, spec, active, onClick} = this.props;
    const {label, icon} = spec;
    return (
      <DocsButton
        active={active}
        disabled={disabled}
        icon={icon}
        id={id}
        label={label}
        onClick={onClick}
        value={spec}
      />
    );
  }
}

module.exports = DocsEditorToolBarButton;

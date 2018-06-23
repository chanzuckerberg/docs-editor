// @flow

import DocsIcon from './DocsIcon';
import React from 'react';
import _ from 'underscore';
import cx from 'classnames';
import {Button} from 'react-bootstrap';

type Props = {
  active?: ?boolean,
  disabled?: boolean,
  icon?: ?string,
  id?: ?string,
  label?: ?string,
  onClick: (v: any) => void,
  value?: any,
};

class DocsButton extends React.PureComponent {
  _mouseDownTarget = null;

  props: Props;

  render(): React.Element<any> {
    const {id, disabled, icon, active, label} = this.props;
    const iconName = icon || 'none';
    const className = cx({
      'docs-button': true,
      'docs-button-disabled': disabled,
      'docs-button-active': active,
      'active': active,
      'disabled': disabled,
      [iconName]: true,
    });
    const child = icon ?
      <DocsIcon icon={icon} /> :
      <span className="docs-button-text">{label}</span>;
    return (
      <Button
        bsSize="xsmall"
        className={className}
        data-docs-tool="true"
        disabled={disabled}
        onMouseDown={disabled ? _.noop : this._onMouseDown}
        onMouseUp={disabled ? _.noop : this._onMouseUp}
        title={label}>
        <span id={id}>
          {child}
        </span>
      </Button>
    );
  }

  _onMouseDown = (e: any) => {
    this._mouseDownTarget = e.target;
    e.preventDefault();
  };

  _onMouseUp = (e: any) => {
    const lastTarget = this._mouseDownTarget;
    if (!lastTarget) {
      return;
    }
    this._mouseDownTarget = null;
    const target = e.target;
    if (
      lastTarget === target ||
      lastTarget.contains(target) ||
      target.contains(lastTarget)
    ) {
      const {onClick, value, disabled} = this.props;
      !disabled && onClick(value);
    }
  };
}

module.exports = DocsButton;

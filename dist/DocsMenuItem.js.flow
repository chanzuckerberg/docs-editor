// @flow

import DocsIcon from './DocsIcon';
import React from 'react';
import cx from 'classnames';
import {MenuItem} from 'react-bootstrap';

import './DocsMenuItem.css';

type onClick = (x: any) => void;

type Props = {
  active?: ?boolean,
  className?: any,
  divider?: ?boolean,
  icon?: ?string,
  label?: ?string,
  onClick?: ?onClick,
  value?: any,
};

class DocsMenuItem extends React.PureComponent {
  _mouseDownTarget = null;
  _valueToEventKey = new Set();

  props: Props;

  render(): React.Element<any> {
    const {divider, label, className} = this.props;
    let {active, icon} = this.props;
    if (active !== undefined && !icon) {
      // use icon to replace the `active` style.
      icon = active ? 'check_box' : 'check_box_outline_blank';
      active = undefined;
    }

    const iconChild = icon ?
      <DocsIcon className="docs-menuitem-icon" icon={icon} /> :
      null;
    const labelChild = label ?
      <span className="docs-menuitem-text">{label}</span> :
      null;
    const cxName = cx(className, 'docs-menuitem');
    if (divider) {
      return (
        <MenuItem
          className={cxName}
          data-docs-tool="true"
          divider
        />
      );
    }

    return (
      <MenuItem
        active={active}
        className={cxName}
        data-docs-tool="true"
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}>
        {iconChild}
        {labelChild}
      </MenuItem>
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
      const {onClick, value} = this.props;
      // $FlowFixMe
      onClick(value);
    }
  };
}

module.exports = DocsMenuItem;

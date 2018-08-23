// @flow

import React from 'react';
import cx from 'classnames';
import {DropdownButton} from 'react-bootstrap';
import uniqueID from './uniqueID';

class DocsDropdownButton extends React.PureComponent {

  _mouseDownTarget = null;
  _id = uniqueID();

  props: {
    className?: any,
  };

  render(): React.Element<any> {
    const className = cx(this.props.className, 'docs-dropdown-button');
    return (
      <DropdownButton
        className={className}
        data-docs-tool="true"
        id={this._id}
        {...this.props}
      />
    );
  }
}

module.exports = DocsDropdownButton;

// @flow

import React from 'react';
import cx from 'classnames';
import {FormControl} from 'react-bootstrap';

type Props = {
  value?: any,
};

class DocsButton extends React.PureComponent {
  _mouseDownTarget = null;

  props: Props;

  render(): React.Element<any> {
    const {value} = this.props;

    return (
      <FormControl
        type="text"
        value={value}
        onChange={this._onChange}
      />
    );
  }

  _onChange = (e: any) => {

  };

}

module.exports = DocsButton;

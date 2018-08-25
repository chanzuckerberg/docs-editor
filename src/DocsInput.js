// @flow

import React from 'react';
import cx from 'classnames';
import {FormControl} from 'react-bootstrap';

type Props = {
  onChange?: (e: SyntheticInputEvent) => void,
  placeholder?: ?string,
  value?: any,
};

class DocsButton extends React.PureComponent {
  _mouseDownTarget = null;

  props: Props;

  render(): React.Element<any> {
    const {value, placeholder} = this.props;

    return (
      <FormControl
        onChange={this._onChange}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    );
  }

  _onChange = (e: SyntheticInputEvent) => {
    const {onChange} = this.props;
    onChange && onChange(e);
  };

}

module.exports = DocsButton;

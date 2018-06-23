// @flow

import React from 'react';

type Props = {
  icon: string,
};

class DocsIcon extends React.PureComponent {

  props: Props;

  render(): React.Element<any> {
    const {icon} = this.props;

    return (
      <span>
        {icon}
      </span>
    );
  }
}

module.exports = DocsIcon;

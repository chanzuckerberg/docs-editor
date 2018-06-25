// @flow

import React from 'react';
import cx from 'classnames';

type Props = {
  className?: string,
  icon: string,
};

class DocsIcon extends React.PureComponent {

  props: Props;

  render(): React.Element<any> {
    const {className, icon} = this.props;
    const allClassNames = cx('material-icons', className);
    return (
      <i className={allClassNames}>
        {icon}
      </i>
    );
  }
}

module.exports = DocsIcon;

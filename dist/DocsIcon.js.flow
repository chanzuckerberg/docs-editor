// @flow

import DocsDataAttributes from './DocsDataAttributes';
import React from 'react';
import cx from 'classnames';

import './DocsIcon.css';

type Props = {
  className?: ?string,
  icon: string,
  onClick?: ?(e: SyntheticEvent) => void,
  title?: ?string,
};

class DocsIcon extends React.PureComponent {

  props: Props;

  render(): React.Element<any> {
    const {className, icon, onClick, title} = this.props;
    const allClassNames = cx('docs-icon', className);

    const attrs = onClick ?
      {
        [DocsDataAttributes.TOOL]: true,
      } :
      null;
    return (
      <i
        {...attrs}
        className={allClassNames}
        onClick={onClick}
        title={title}>
        {icon}
      </i>
    );
  }
}

module.exports = DocsIcon;

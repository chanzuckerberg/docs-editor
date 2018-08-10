// @flow

import React from 'react';

import type {DocsLinkEtityData} from './Types';

type Props = {
  entityData: DocsLinkEtityData,
  children?: any,
};

class DocsLink extends React.Component {
  props: Props;

  render(): React.Element<any> {
    const {entityData, children} = this.props;
    const {url} = entityData;
    return (
      <a
        data-docs-link="true"
        href={url || '#'}
        target="_blank">
        {children}
      </a>
    );
  }
}

module.exports = DocsLink;

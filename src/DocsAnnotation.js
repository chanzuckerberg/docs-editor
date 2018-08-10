// @flow

import React from 'react';

import type {DocsAnnotationEtityData} from './Types';

import './DocsAnnotation.css';

type Props = {
  entityData: DocsAnnotationEtityData,
  children?: any,
};

// This component for highlighted text.
class DocsAnnotation extends React.Component {
  props: Props;

  render(): React.Element<any> {
    const {children, entityData} = this.props;
    return (
      <span className="docs-annotation">
        {children}
      </span>
    );
  }
}

module.exports = DocsAnnotation;

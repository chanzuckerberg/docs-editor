// @flow

import React from 'react';

type Props = {
  url: ?string,
  contentState?: any,
  entityKey?: string,
  children?: any,
};

// This component for highlighted text.
class DocsAnnotation extends React.Component {
  props: Props;

  render(): React.Element<any> {
    const {children} = this.props;
    return (
      <span className="docs-annotation">
        {children}
      </span>
    );
  }
}

module.exports = DocsAnnotation;

/* @flow */

import React from 'react';
import {EditorBlock} from 'draft-js'

type BlockProps = {
  start?: ?number,
};

type Props = {
  blockProps: BlockProps,
  className?: ?string,
  offsetKey: string,
  ordered: boolean,
};

class DocsList extends React.Component {

  props: any;

  render() {
    const {
      children,
      className,
      offsetKey,
      ordered,
    } = this.props
    return ordered ?
      <ol
        className={className}
        data-offset-key={offsetKey}>
        {children}
      </ol> :
      <ul
        className={className}
        data-offset-key={offsetKey}>
        {children}
      </ul>;
  }
}

class DocsOrderedList extends React.Component {
  render(): React.Element<any> {
    return <DocsList ordered={true} {...this.props} />;
  }
}

class DocsUnorderedList extends React.Component {
  render(): React.Element<any> {
    return <DocsList ordered={true} {...this.props} />;
  }
}

export default {
  Ordered: DocsOrderedList,
  Unordered: DocsUnorderedList,
};

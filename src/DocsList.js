/* @flow */

import React from 'react';
import cx from 'classnames';
import invariant from 'invariant';
import {EditorBlock} from 'draft-js';

import './DocsList.css';

function getListItemBlockData(listItem: ?React.Element<any>): ?Object {
  if (!listItem || !listItem.props.children) {
    return null;
  }
  const content = React.Children.only(listItem.props.children);
  if (
    !content ||
    !content.props ||
    !content.props.block ||
    !content.props.block.data
  ) {
    return null;
  }
  return content.props.block.data;
}

function renderListItems(
  listItems: React.Children,
  ordered: boolean,
): Array<React.Element<any>> {
  return React.Children.map(listItems, (listItem, index) => {
    invariant(listItem.type === 'li', 'invalid type');
    const {children, className} = listItem.props;
    const blockData = getListItemBlockData(listItem);
    const safeClassName = className ?
      className.replace(/public-DraftStyleDefault/g, '_') :
      '';
    const start = blockData ? blockData.get('start') : 1;
    const listStyleTypeDefault = ordered ? 'decimal' : 'disc';
    const listStyleType =
      blockData && blockData.get('listStyleType') ||
      listStyleTypeDefault;
    const attributes = {
      className: cx(className, {
        'docs-list-item': true,
        // [listStyleType]: true,
      }),
      'data-counter-start': start,
      'data-counter-value': start + index,
    };
    return React.cloneElement(listItem, attributes);
  });
}

// http://www.cssdesk.com/H9r2K
class DocsListItem extends React.Component {
  render(): React.Element<any> {
    return <EditorBlock {...this.props} />;
  }
}

class DocsListBase extends React.Component {
  render(): React.Element<any> {
    const {className, ordered, children, ...restProps} = this.props;
    const items = renderListItems(children, ordered);
    // Uset the first list-item to serve the block data.
    const blockData = getListItemBlockData(items[0]);
    const start = blockData ? blockData.get('start') : null;
    const listStyleTypeDefault = ordered ? 'decimal' : 'disc';
    const listStyleType =
      blockData && blockData.get('listStyleType') ||
      listStyleTypeDefault;

    const mainClassName = cx(className, {
      'docs-list-type': true,
      [listStyleType]: true,
    });

    const props = {
      ...restProps,
      start: start || 1,
      children: items,
      className: mainClassName,
    };

    return ordered ? <ol {...props} /> : <ul {...props} />;
  }
}

class DocsListOrdered extends React.Component {
  render(): React.Element<any> {
    return <DocsListBase {...this.props} ordered={true} />;
  }
}

class DocsListUnordered extends React.Component {
  render(): React.Element<any> {
    return <DocsListBase {...this.props} ordered={false} />;
  }
}

export default {
  Item: DocsListItem,
  Ordered: DocsListOrdered,
  Unordered: DocsListUnordered,
};

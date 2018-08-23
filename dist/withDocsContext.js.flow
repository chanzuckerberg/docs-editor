// @flow

import DocsContext from './DocsContext';
import invariant from 'invariant';

import PropTypes from 'prop-types';

function withDocsContext(Component: Function): Function {

  invariant(
    !Component.contextTypes && !Component.prototype.getChildContext,
    'Component already has contextTypes'
  );

  Component.contextTypes = {
    docsContext: PropTypes.instanceOf(DocsContext),
  };

  Component.childContextTypes = {
    docsContext: PropTypes.instanceOf(DocsContext),
  };

  Component.prototype.getChildContext = function getChildContext() {
    const docsContext = this.context.docsContext || this.props.docsContext;
    invariant(!!docsContext, 'docsContext is not provided');
    return {
      docsContext,
    };
  };
  return Component;
}

module.exports = withDocsContext;

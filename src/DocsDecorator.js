// @flow

import DocsDecoratorEntityDataContainer from './DocsDecoratorEntityDataContainer';
import {CompositeDecorator} from 'draft-js';
import {findEntitiesForType} from './DocsHelpers';

const entries = [];

module.exports = {

  // https://draftjs.org/docs/advanced-topics-decorators.html#compositedecorator
  register(decoratorType: string, Component: Function) {
    const strategy = findEntitiesForType.bind(null, decoratorType);
    const fn: Function = DocsDecoratorEntityDataContainer;
    entries.push({
      strategy: strategy,
      component: fn.bind(null, Component, decoratorType),
    });
  },

  get(): CompositeDecorator {
    return new CompositeDecorator(entries);
  },
};

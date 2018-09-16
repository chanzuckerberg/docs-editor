// @flow

import DocsAnnotation from './DocsAnnotation';
import DocsBlockTypeToComponent from './DocsBlockTypeToComponent';
import DocsBlockTypes from './DocsBlockTypes';
import DocsCalculator from './DocsCalculator';
import DocsDecorator from './DocsDecorator';
import DocsDecoratorTypes from './DocsDecoratorTypes';
import DocsExpandable from './DocsExpandable';
import DocsImage from './DocsImage';
import DocsLink from './DocsLink';
import DocsMath from './DocsMath';
import DocsTable from './DocsTable';

function registerCustomBlocks(specs: Array<Array<any>>): void {
  specs.forEach(spec => {
    const [type, view] = spec;
    DocsBlockTypeToComponent.register(type, view);
  });
}

function registerDecorator(specs: Array<Array<any>>): void {
  specs.forEach(spec => {
    const [type, view] = spec;
    DocsDecorator.register(type, view);
  });
}

function init(): void {
  registerCustomBlocks([
    [DocsBlockTypes.DOCS_CALCULATOR, DocsCalculator],
    [DocsBlockTypes.DOCS_EXPANDABLE, DocsExpandable],
    [DocsBlockTypes.DOCS_TABLE, DocsTable],
  ]);

  // Register Decorator
  registerDecorator([
    [DocsDecoratorTypes.DOCS_ANNOTATION, DocsAnnotation],
    [DocsDecoratorTypes.DOCS_IMAGE, DocsImage],
    [DocsDecoratorTypes.DOCS_MATH, DocsMath],
    [DocsDecoratorTypes.LINK, DocsLink],
  ]);
}

module.exports = {
  init,
};

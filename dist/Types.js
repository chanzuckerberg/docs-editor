'use strict';

var _draftJs = require('draft-js');

// e.g. {'color': 'red'}
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_HTMLCollectionLike', {
  value: require('prop-types').shape({
    length: require('prop-types').number.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_CSSStyleDeclarationLike', {
  value: require('prop-types').shape({})
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DocumentLike', {
  value: require('prop-types').shape({
    close: require('prop-types').func.isRequired,
    getElementsByTagName: require('prop-types').func.isRequired,
    open: require('prop-types').func.isRequired,
    querySelectorAll: require('prop-types').func.isRequired,
    styleSheets: require('prop-types').any.isRequired,
    write: require('prop-types').func.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ElementLike', {
  value: require('prop-types').shape({
    appendChild: require('prop-types').func.isRequired,
    cellIndex: require('prop-types').number,
    cells: require('prop-types').shape({
      length: require('prop-types').number.isRequired
    }),
    classList: require('prop-types').shape({
      length: require('prop-types').number.isRequired,
      forEach: require('prop-types').func.isRequired
    }),
    className: require('prop-types').string.isRequired,
    colSpan: require('prop-types').number,
    dispatchEvent: require('prop-types').func.isRequired,
    getAttribute: require('prop-types').func.isRequired,
    getBoundingClientRect: require('prop-types').func.isRequired,
    hasAttribute: require('prop-types').func.isRequired,
    href: require('prop-types').string.isRequired,
    id: require('prop-types').string.isRequired,
    innerHTML: require('prop-types').string.isRequired,
    nextElementSibling: require('prop-types').any,
    nodeName: require('prop-types').string.isRequired,
    nodeType: require('prop-types').number.isRequired,
    outerHTML: require('prop-types').string.isRequired,
    ownerDocument: require('prop-types').shape({
      close: require('prop-types').func.isRequired,
      getElementsByTagName: require('prop-types').func.isRequired,
      open: require('prop-types').func.isRequired,
      querySelectorAll: require('prop-types').func.isRequired,
      styleSheets: require('prop-types').any.isRequired,
      write: require('prop-types').func.isRequired
    }).isRequired,
    parentElement: require('prop-types').any,
    parentNode: require('prop-types').any,
    previousElementSibling: require('prop-types').any,
    querySelectorAll: require('prop-types').func.isRequired,
    removeAttribute: require('prop-types').func.isRequired,
    rowIndex: require('prop-types').number,
    rowSpan: require('prop-types').number,
    rows: require('prop-types').shape({
      length: require('prop-types').number.isRequired
    }),
    setAttribute: require('prop-types').func.isRequired,
    style: require('prop-types').shape({}).isRequired,
    tBodies: require('prop-types').shape({
      length: require('prop-types').number.isRequired
    }).isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ClientRectLike', {
  value: require('prop-types').shape({
    height: require('prop-types').number.isRequired,
    left: require('prop-types').number.isRequired,
    right: require('prop-types').number.isRequired,
    width: require('prop-types').number.isRequired,
    x: require('prop-types').number.isRequired,
    y: require('prop-types').number.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ImageLike', {
  value: require('prop-types').shape({
    height: require('prop-types').number.isRequired,
    id: require('prop-types').string.isRequired,
    src: require('prop-types').string.isRequired,
    width: require('prop-types').number.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DocsEditorProps', {
  value: require('prop-types').shape({
    docsContext: require('prop-types').object,
    editorState: require('prop-types').any.isRequired,
    id: require('prop-types').string,
    onChange: require('prop-types').func.isRequired,
    placeholder: require('prop-types').string
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DocsEditorLike', {
  value: require('prop-types').shape({
    id: require('prop-types').string.isRequired,
    props: require('prop-types').shape({
      docsContext: require('prop-types').object,
      editorState: require('prop-types').any.isRequired,
      id: require('prop-types').string,
      onChange: require('prop-types').func.isRequired,
      placeholder: require('prop-types').string
    }).isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DocsLinkEtityData', {
  value: require('prop-types').shape({
    url: require('prop-types').string.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DocsAnnotationEtityData', {
  value: require('prop-types').shape({
    token: require('prop-types').string,
    color: require('prop-types').string.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DocsTableEntityData', {
  value: require('prop-types').shape({
    cellBgStyles: require('prop-types').shape({}),
    cellColSpans: require('prop-types').shape({}),
    cellRowSpans: require('prop-types').shape({}),
    colWidths: require('prop-types').arrayOf(require('prop-types').number),
    rowHeights: require('prop-types').shape({}),
    colsCount: require('prop-types').number.isRequired,
    leftColBgStyle: require('prop-types').string,
    noBorders: require('prop-types').bool,
    paddingSize: require('prop-types').string,
    rowsCount: require('prop-types').number.isRequired,
    topRowBgStyle: require('prop-types').any
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DocsImageEntityData', {
  value: require('prop-types').shape({
    align: require('prop-types').string,
    frame: require('prop-types').bool,
    height: require('prop-types').number,
    url: require('prop-types').string,
    width: require('prop-types').number
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DocsMathEntityData', {
  value: require('prop-types').shape({
    asciimath: require('prop-types').string,
    latex: require('prop-types').string,
    text: require('prop-types').string,
    xml: require('prop-types').string
  })
});
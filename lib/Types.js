'use strict';

var _draftJs = require('draft-js');

// TODO(Fix this.)
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_Action', {
  value: require('prop-types').shape({
    editor: require('prop-types').any.isRequired,
    type: require('prop-types').string.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ReducerState', {
  value: require('prop-types').shape({
    editorState: require('prop-types').any.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DOMRect', {
  value: require('prop-types').shape({
    height: require('prop-types').number.isRequired,
    width: require('prop-types').number.isRequired,
    x: require('prop-types').number.isRequired,
    y: require('prop-types').number.isRequired
  })
});


// This defines the APIs that depend on the specific app that the editor
// is running within. This serves as a bridge to enable editor communicate
// with the app server to do tasks such as uploading images, load comments,
// ...etc.
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_DOMImage', {
  value: require('prop-types').shape({
    element: require('prop-types').any,
    height: require('prop-types').number.isRequired,
    src: require('prop-types').string.isRequired,
    width: require('prop-types').number.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_EditorRuntime', {
  value: require('prop-types').shape({
    canUploadImage: require('prop-types').func.isRequired,
    canProxyImageSrc: require('prop-types').func.isRequired,
    getProxyImageSrc: require('prop-types').func.isRequired,
    uploadImage: require('prop-types').func.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_EditorProps', {
  value: require('prop-types').shape({
    docsContext: require('prop-types').object,
    editorState: require('prop-types').any.isRequired,
    id: require('prop-types').string,
    onChange: require('prop-types').func.isRequired,
    placeholder: require('prop-types').string
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_BaseEditor', {
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
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_LinkEtityData', {
  value: require('prop-types').shape({
    url: require('prop-types').string.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_AnnotationEtityData', {
  value: require('prop-types').shape({
    token: require('prop-types').string,
    color: require('prop-types').string.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_TableEntityData', {
  value: require('prop-types').shape({
    colWidths: require('prop-types').arrayOf(require('prop-types').number),
    colsCount: require('prop-types').number.isRequired,
    leftColBgStyle: require('prop-types').string,
    noBorders: require('prop-types').bool,
    paddingSize: require('prop-types').string,
    rowsCount: require('prop-types').number.isRequired,
    topRowBgStyle: require('prop-types').any
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ImageEntityData', {
  value: require('prop-types').shape({
    align: require('prop-types').string,
    frame: require('prop-types').bool,
    height: require('prop-types').number,
    url: require('prop-types').string,
    width: require('prop-types').number
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_MathEntityData', {
  value: require('prop-types').shape({
    asciimath: require('prop-types').string,
    latex: require('prop-types').string,
    text: require('prop-types').string,
    xml: require('prop-types').string
  })
});
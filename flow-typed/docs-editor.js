// @flow

declare module "docs-editor" {
  declare module.exports: {
    DocsActionTypes: any,
    DocsContext: any,
    DocsEditor: any,
    DocsImageUploadControl: any,
    EditorState: any,
    Timer: any,
    captureDocumentEvents: any,
    convertFromRaw: any,
    convertToRaw: any,
    withDocsContext: any,
    isEditorStateEmpty: any,
    showModalDialog: any,
    uniqueID: any,
  };
}

// declare module "docs-editor" {
//   declare class ThisModule {
//     uniqueID: wtf,
//   }
//
//   declare module.exports: ThisModule;
//
//   // Declares a default export whose type is `typeof URL`
//   // declare export default typeof ThisModule;
// }

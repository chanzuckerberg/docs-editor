// @flow

import React from 'react';

import type {ImageLike, RenderCommentProps} from './Types';

// This defines abstract class with the APIs that depend on the specific app
// that the editor is running within. This serves as a bridge to enable editor
// communicate with the app server to do tasks such as uploading images,
// load comments, ...etc.

class DocsEditorRuntime {
  canUploadImage(): boolean {
    return false;
  }
  canLoadHTML(): boolean {
    return false;
  }
  canComment(): boolean {
    return false;
  }
  canProxyImageBlob(src: string): boolean {
    return false;
  }
  canProxyImageSrc(src: string): boolean {
    return false;
  }
  createCommentThreadID(): string {
    return '';
  }
  getProxyImageBlob(): ?Blob {
    return null;
  }
  getProxyImageSrc(src: string): string {
    return src;
  }
  uploadImage (obj: Blob): Promise<ImageLike> {
    return Promise.reject('Unsupported');
  }
  loadHTML(): Promise<?string> {
    return Promise.reject('Unsupported');
  }
  renderComment(
    props: RenderCommentProps,
  ): ?React.Element<any> {
    return null;
  }
};

export default DocsEditorRuntime;

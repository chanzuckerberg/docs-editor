// @flow

import DocsDataAttributes from './DocsDataAttributes';
import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import withDocsContext from './withDocsContext';
import nullthrows from 'nullthrows';

import './DocsSafeImage.css';

import type {ImageLike} from './Types';

type Props = {
  alt?: string,
  className?: any,
  height?: ?number,
  id?: string,
  onError?: ?(e: Error) => void,
  onLoad?: ?(m: ImageLike) => void,
  onClick?: ?(e: any) => void,
  src: ?string,
  width?: ?number,
};

/**
 * This component load and render image safely
 * - It loads image that can be proxied as a safe image.
 * - It manages the async image loading without worrying about race-condition.
 */
class DocsSafeImage extends React.PureComponent {
  props: Props;

  state = {
    error: false,
    objectURL: null,
    pending: true,
  };

  _ref = null;
  _renderedSrc = null;
  _unmounted = false;

  componentDidMount(): void {
    this._maybeLoadObjectUrl();
  }

  componentDidUpdate(): void {
    this._maybeLoadObjectUrl();
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.src !== this.props.src) {
      const {objectURL} = this.state;
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
      this.setState({error: false, objectURL: null, pending: true});
    }
  }

  componentWillUnmount(): void {
    const {objectURL} = this.state;
    if (objectURL) {
      URL.revokeObjectURL(objectURL);
    }
    this._unmounted = true;
  }

  render(): React.Element<any> {
    const {alt, className, id, width, height, onClick} = this.props;
    const {error, pending, objectURL} = this.state;
    const {runtime} = this.context.docsContext;

    let {src} = this.props;
    let empty = false;

    if (!error) {
      if (objectURL) {
        src = objectURL;
      } else if (src && runtime && runtime.canProxyImageBlob(src)) {
        src = null;
      } else if (src && runtime && runtime.canProxyImageSrc(src)) {
        src = runtime.getProxyImageSrc(src);
      } else if (!src) {
        empty = true;
      }
    }

    src = String(src || '');

    const altText = error ?
      `unable to load image from ${src}`:
      alt;

    const cxName = cx(className, {
      'docs-safe-image': true,
      'docs-safe-image-pending': pending,
      'docs-safe-image-error': error,
      'docs-safe-image-empty': empty,
      'error': error,
    });

    const attrs = {
      [DocsDataAttributes.ELEMENT]: true,
    };
    let style;
    if (width && height) {
      style = {
        width: width + 'px',
        height: height + 'px',
      };
    } else if (width) {
      style = {
        width: width + 'px',
      };
    } else if (height) {
      style = {
        height: height + 'px',
      };
    } else {
      style = {
        maxWidth: '100%',
      };
    }

    // An image is loaded asynchronously. We need to keep track of the current
    // image src that is being rendered.
    this._renderedSrc = src;

    return (error || empty) ?
      <span
        {...attrs}
        className={cxName}
        id={id}
        onClick={onClick}
        style={style}
        title={altText}>
        {src}
      </span> :
      <img
        {...attrs}
        alt={altText}
        className={cxName}
        id={id}
        key={src}
        onClick={onClick}
        onError={this._onError.bind(this, src)}
        onLoad={this._onLoad.bind(this, src)}
        ref={this._onRef}
        src={src}
        style={style}
      />;
  }

  _onLoad = (src: string): void => {
    if (!this._unmounted && src && src === this._renderedSrc) {
      this.setState(
        {error: false, pending: false},
        this._didLoad,
      );
    }
  };

  _onError = (src: string): void => {
    if (!this._unmounted && src && src === this._renderedSrc) {
      this.setState(
        {error: true, pending: false},
        this._didError,
      );
    }
  };

  _onRef = (ref: any): void => {
    this._ref = ref;
  };

  _didLoad = (): void => {
    const {onLoad, src, id} = this.props;
    if (onLoad) {
      const element: any = nullthrows(ReactDOM.findDOMNode(this._ref));
      onLoad({
        src: nullthrows(src),
        height: nullthrows(element.naturalHeight),
        width: nullthrows(element.naturalWidth),
        id: id || '',
      });
    }
  };

  _didError = (): void => {
    const {onError, src} = this.props;
    if (onError) {
      const msg = src ?
        `failed to load image from ${String(src)}` :
        'Image url can\'t be empty';
      onError(new Error(msg));
    }
  };

  _maybeLoadObjectUrl(): void {
    const {src} = this.props;
    const {objectURL} = this.state;
    const {runtime} = this.context.docsContext;

    if (!objectURL && src && runtime && runtime.canProxyImageBlob(src)) {
      this._getProxyImageObjectURL(runtime, src);
    }
  }

  _getProxyImageObjectURL = async (runtime, src): Promise<void> => {
    try {
      const imageBlob = await runtime.getProxyImageBlob(src);
      if (!this._unmounted && src === this.props.src) {
        const objectURL = URL.createObjectURL(imageBlob);
        this.setState({objectURL});
      }
    } catch(ex) {
      if (!this._unmounted && src === this.props.src) {
        this.setState({error: true, pending: false});
      }
    }
  }
}

module.exports = withDocsContext(DocsSafeImage);

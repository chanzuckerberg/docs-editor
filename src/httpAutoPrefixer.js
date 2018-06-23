// @flow

import _ from 'underscore';
import URI from 'uri-js';

const URL_PROTOCOLS = {
  HTTP: 'http',
  HTTPS: 'https',
};

function httpAutoPrefixer(url: $FlowFixMe) {
  if (url && !_.isEmpty(url.trim())) {
    const parsedURL = URI.parse(url);

    if (!_.contains(_.values(URL_PROTOCOLS), parsedURL.scheme)) {
      // User entered url without a protocol so default to `http`
      // since most content sites are only `http`, and most sites
      // know to auto-redirect `http` back to `https`
      const parsedURLSuffix = URI.parse(url, {reference: 'suffix'});
      parsedURLSuffix.scheme = URL_PROTOCOLS.HTTP;
      return URI.serialize(parsedURLSuffix);
    }
  }
  return url;
}

module.exports = httpAutoPrefixer;

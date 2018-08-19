#!/bin/bash

# Must run this script before committing to repository if JS files within `src`
# had changed.

# Build ES5 modules to lib
# See https://medium.com/netscape/shipping-flowtype-definitions-in-npm-packages-c987917efb65
rm -fr dist
./node_modules/.bin/babel src --out-dir dist --presets=es2015,react,env,react --plugins=transform-export-extensions,transform-class-properties,transform-runtime,flow-react-proptypes,transform-object-rest-spread,transform-es2015-parameters,transform-flow-strip-types

flow-copy-source -v -i '**/__tests__/**' src dist

# Copy CSS files.
cp src/*.css dist/

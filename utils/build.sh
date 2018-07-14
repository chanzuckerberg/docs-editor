# Build ES5 modules to lib
./node_modules/.bin/babel src --out-dir lib --presets=es2015,react,env,react --plugins=transform-export-extensions,transform-class-properties,transform-runtime,flow-react-proptypes,transform-react-remove-prop-types,transform-flow-strip-types,transform-object-rest-spread,transform-es2015-parameters

# Copy CSS files.
cp src/*.css lib/

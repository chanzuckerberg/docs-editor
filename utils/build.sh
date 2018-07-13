# Build ES5 modules to transcompiled

./node_modules/.bin/babel src --out-dir transcompiled --presets=es2015,react,env,react --plugins=transform-class-properties,transform-runtime,flow-react-proptypes,transform-react-remove-prop-types,transform-flow-strip-types,transform-object-rest-spread,transform-es2015-parameters

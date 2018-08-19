#!/bin/bash

# This builds the `utils/html_to_json_runtime_lib.js`
# for `utils/html_to_json_lib.js`

node node_modules/webpack/bin/webpack web_src/html_to_json_runtime.js
cp web_app/html_to_json_runtime.bundle.js utils/html_to_json_runtime_lib.js

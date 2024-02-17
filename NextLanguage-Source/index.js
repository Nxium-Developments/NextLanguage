const fs = require('fs');
const fsextra = require('fs-extra');
const path = require('path');

require('./backend/build/main');
require('./backend/build/createbuilds')
require('./backend/build/checkindex_nxlexists')
require('./frontend/build/checks-buildfile')
require('./frontend/build/checks-indexfile')

// require('./backend/assets/components/projectbuildfile');
// Disabled because THIS IS AN TEST BUILD DATA FILE

// require('./backend/assets/components/projectwriteconfig');
// Disabled Write to BUILD.JSON due to configuration error
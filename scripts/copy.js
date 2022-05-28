const fsExtra = require('fs-extra');
const path = require('path');

fsExtra.copySync(
  path.resolve(__dirname, '../src/templates'),
  path.resolve(__dirname, '../dist/templates'),
  {
    dereference: true
  }
);

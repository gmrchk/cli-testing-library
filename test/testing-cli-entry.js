#!/usr/bin/env node
const path = require('path');

require('ts-node').register({
    project: path.join(__dirname, '..', 'tsconfig.json'),
    dir: __dirname,
});

require('./testing-cli.ts');

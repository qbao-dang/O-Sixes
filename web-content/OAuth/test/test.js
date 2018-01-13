/* global describe */
'use strict';

const lint = require('mocha-eslint');

describe('Code Standards', function () {
  lint(['server.js', 'config/**/*.js', 'routes/**/*.js', 'test/**/*.js']);
});

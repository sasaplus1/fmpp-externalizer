import assert = require('assert');

import { externalize } from '../index';

describe('index', function () {
  describe('#externalize', function () {
    it("convert include directive's param with String", function () {
      assert(
        externalize(`<#include "/path/to/file" />`, {
          match: '/path/to/file',
          to: '/@root/path/to/file'
        }) === '<#include "/@root/path/to/file" />'
      );
    });
    it("convert include directive's param with RegExp", function () {
      assert(
        externalize(`<#include "/path/to/file" />`, {
          match: /\/path\/to\/file/,
          to: '/@root/path/to/file'
        }) === '<#include "/@root/path/to/file" />'
      );
    });
    it("convert include directive's param with Function", function () {
      assert(
        externalize(`<#include "/path/to/file" />`, {
          match(value) {
            return value.replace(/^\//, '/@root/');
          }
        }) === '<#include "/@root/path/to/file" />'
      );
    });
    it("convert include directive's within HTML", function () {
      assert(
        externalize(
          `<!DOCTYPE html><#include "/path/to/file" /><h1>It Works!</h1>`,
          {
            match: '/path/to/file',
            to: '/@root/path/to/file'
          }
        ) ===
          '<!DOCTYPE html><#include "/@root/path/to/file" /><h1>It Works!</h1>'
      );
    });
    it('remove extra spaces if match', function () {
      assert(
        externalize(`<#include     "/path/to/file"     />`, {
          match: '/path/to/file',
          to: '/path/to/file'
        }) === '<#include "/path/to/file" />'
      );
    });
    it('return raw texts', function () {
      assert(
        externalize(`some text <p>and HTML</p>`, { match: '', to: '' }) ===
          'some text <p>and HTML</p>'
      );
    });
  });
});

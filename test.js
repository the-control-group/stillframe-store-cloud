'use strict';

var stream = require('stream');
var assert = require('chai').assert;
var CloudStore = require('./index.js');

describe('CloudStore', function(){
	var file = new CloudStore({
		pkgcloud: {
			provider: 'rackspace'
		}
	});

	describe('fetch', function(){
		var timestamp = Date.now();

		it('returns a readable stream', function(){
			var s = file.fetch('echo', 'ad8cee67138e73009d4e22831ec6eb3b7f9e60da', timestamp);
			assert.isFunction(s._read);
		});
	});

	describe('save', function(){
		var timestamp = Date.now();

		it('returns a writable stream', function(){
			var s = file.save('echo', 'ad8cee67138e73009d4e22831ec6eb3b7f9e60da', timestamp);
			assert.isFunction(s._write);
		});
	});

});

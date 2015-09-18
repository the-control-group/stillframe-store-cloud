'use strict';

var stream = require('stream');
var pkgcloud = require('pkgcloud');

function CloudStore(config){
	this.config = config;

	// create the pkgcloud client
	this.client = pkgcloud.storage.createClient(this.config.pkgcloud);
}

// fetch a file from cache
// @return instance of stream.Readable
CloudStore.prototype.fetch = function fetch(engineId, hash, timestamp) {
	return this.client.download({
		container: this.config.container,
		remote: [engineId, hash, timestamp].join(':')
	})
};

// save a file to cache
// @return instance of stream.Writable
CloudStore.prototype.save = function save(engineId, hash, timestamp, ttl) {
	return this.client.upload({
		container: this.config.container,
		remote: [engineId, hash, timestamp].join(':'),
		headers: {
			'X-Delete-At': timestamp + ttl
		}
	})
};

module.exports = CloudStore;
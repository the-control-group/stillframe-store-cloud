'use strict';

var pkgcloud = require('pkgcloud');

function CloudStore(config){
	this.config = config;

	// create the pkgcloud client
	this.client = pkgcloud.storage.createClient(this.config.pkgcloud);
}

// fetch a file from cache
// @return instance of stream.Readable
CloudStore.prototype.fetch = function fetch(hash, timestamp) {

	// pipe the data
	var stream = this.client.download({
		container: this.config.container,
		remote: [hash, timestamp].join(':')
	});

	// fetch the file metadata
	this.client.getFile(this.config.container, [hash, timestamp].join(':'), function(err, file) {
		if(err) return stream.emit('error', err);
		stream.emit('metadata', {
			size: file.size,
			contentType: file.contentType
		});
	});

	return stream;
};

// save a file to cache
// @return instance of stream.Writable
CloudStore.prototype.save = function save(hash, timestamp, metadata, ttl) {
	var options = {
		container: this.config.container,
		remote: [hash, timestamp].join(':'),
		headers: {
			'X-Delete-At': (timestamp + ttl) / 1000 + 60
		}
	};

	if(metadata.size) options.size = metadata.size;
	if(metadata.contentType) options.contentType = metadata.contentType;

	return this.client.upload(options);
};

module.exports = CloudStore;
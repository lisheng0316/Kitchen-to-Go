/**
 * Copyright (C) Joel R Corporan - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joel Corporan <joel.corporan@gmail.com>, February 2016, Case Number:1-3166280427
 *
 * The MongoManager module is the access to no-structure data. This data is stored in a
 * NoSQL database. Report of feedback and problem data, as well as, Geolocation data are store
 * on this database.
 * @author: Joel R. Corporan
 */

/**
 * Module Import
 */
var mongodb = require('mongodb');
var NoSQLconnection

module.exports = function MongoManager(NoSQL) {

	NoSQLconnection = NoSQL;

	this.insert = function(collection, data, callback_insert) {
		insert(collection, data, callback_insert);
	}

	this.update = function(collection, query, set, callback_update) {
		update(collection, query, set, callback_update);
	}

	this.remove = function(collection, query, callback_remove) {
		remove(collection, query, callback_remove);
	}

	this.find = function(collection, data, limit, callback_find) {
		find(collection, data, limit, callback_find);
	}

	this.findLocation = function(collection, coordinate, limit, callback_find) {
		findLocation(collection, coordinate, limit, callback_find);
	}
}

function insert(collection, data, callback_insert) {
	beginConnection(function(error, client) {
		if(!error) {
			client.collection(collection).insertOne(data, function(err, result) {
				if(!err) {
					endConnection(client);
					callback_insert(null, result);
				}
				else {
					endConnection(client);
					callback_insert(err, null);
				}
			});
		}
		else {
			callback_insert(error, null);
		}
	});
}

function remove(collection, data, callback_remove) {
	beginConnection(function(error, client) {
		if(!error) {
			client.collection(collection).remove(data, function(err, result) {
				if(!err) {
					endConnection(client);
					callback_remove(null, result);
				}
				else {
					endConnection(client);
					callback_remove(err, null);
				}
			});
		}
		else {
			callback_remove(error, null);
		}
	});
}

function update(collection, query, set, callback_update) {
	beginConnection(function(error, client) {
		if(!error) {
			client.collection(collection).updateOne(query, set, function(err, result) {
				if(!err) {
					endConnection(client);
					callback_update(null, result);
				}
				else {
					endConnection(client);
					callback_update(err, null);
				}
			});
		}
		else {
			callback_update(error, null);
		}
	});
}

function find(collection, find, limit, callback_find) {
	beginConnection(function(error, client) {
		if(!error) {
			client.collection(collection).find(find, limit).toArray(function(err, result) {
				if(!err) {
					if(result[0] == undefined) {
						endConnection(client);
						callback_find(null, result[0]);
					}
					else {
						endConnection(client);
						callback_find(null, result[0]);
					}
				}
				else {
					endConnection(client);
					callback_find(err, null);
				}
			});
		}
		else {
			callback_find(error, null);
		}
	});
}

function findLocation(collection, coordinate, limit, callback_findLocation) {
	beginConnection(function(error, client) {
		if(!error) {
			client.collection(collection).find( 
				{ 
					location: { 
   						$geoWithin: { 
   							$centerSphere: [ 
   								[ coordinate.longitude, coordinate.latitude ], 
   								coordinate.miles / 3963.2 
   							] 
   						} 
   					} 
   				}, limit).toArray(function(err, result) {
					if(!err) {
						if(result[0] == undefined || result.length == 0) {
							endConnection(client);
							callback_findLocation(null, result);
						}
						else {
							endConnection(client);
							callback_findLocation(null, result);
						}
					}
					else {
						endConnection(client);
						callback_findLocation(err, null);
					}
			});
		}
		else {
			callback_findLocation(error, null);
		}
	});
}


function beginConnection(callback_connect) {
	mongodb.connect(NoSQLconnection, function (err, db) {
		if (err) {
	    	console.log('Unable to connect to the mongoDB server. Error:', err);
	    	callback_connect(err, null);
	  	}
	  	else {
	    	console.log('MongoDB Database Connected');
	    	callback_connect(err, db);
		}
	});
}

function endConnection(client) {
	client.close();
}

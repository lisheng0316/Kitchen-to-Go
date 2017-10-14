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
const mongodb = require('mongodb');

module.exports = function MongoManager() {

	const NoSQLconnection = process.env.MONGO_DATABASE;

	this.insert = function(collection, data, callback_insert) {
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

	this.udpdate = function(collection, identifier, informationToUpdate, callback_update) {
		beginConnection(function(error, client) {
			if(!error) {
				client.collection(collection).update(identifier, { $set: informationToUpdate}, function(err, result) {
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

	this.findLocation = function(collection, coordinate, callback_findLocation) {
		beginConnection(function(error, client) {
			if(!error) {
				client.collection(collection).find( 
					{ 
						loc : { 
							$geoIntersects : { 
								$geometry : { 
									type : "Point", 
									coordinates : [ 
										coordinate.longitude, 
										coordinate.latitude
									] 
								}
							}
						}
					}).toArray(function(err, result) {
						if(!err) {
							if(result[0] == undefined || result.length == 0) {
								endConnection(client);
								callback_findLocation(null, result);
							}
							else {
								endConnection(client);
								callback_findLocation(null, result[0]);
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

	var beginConnection = function(callback_connect) {
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

	var endConnection = function(client) {
		client.close();
	}
}

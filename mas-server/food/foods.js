/**
 * This module handle the Food (CRUD Operations).
 * @author: Joel R. Corporan
 */

var uuid = require('uuid');
var aws = require('aws-sdk');
var NodeGeocoder = require('node-geocoder');

var noSQLConnection;

module.exports = function Foods(mongo) {

	noSQLConnection = mongo;
	
	/**
	 * This method handler the Food pass for the user to post a food.
	 * @param callback_getFoodPass: A callback function to return the result of the request.
	 */
	this.getFoodPass = function(callback_getFoodPass) {
		getPass(callback_getFoodPass);
	}

	/**
	 * This method handler the Food pass for the user to post a food.
	 * @param food: Food to be posted.
	 * @param callback_getFoodPass: A callback function to return the result of the request.
	 */
	this.createFood = function(cooker, food, callback_createFood) {
		getCoordinate(cooker, function(error, result) {
			if(error) {
				callback_createFood(error);
			} else {
				create(cooker, food, result, callback_createFood);
			}
		});
	}

	/**
	 * This method handler the food retrieval
	 * @param food: Food to be posted.
	 * @param callback_getFoodPass: A callback function to return the result of the request.
	 */
	this.getFoods = function(foodId, callback_getFood) {
		getFoods(foodId, callback_getFood);
	}

	/**
	 * This method handler the food retrieval from a certain Id
	 * @param food: Food to be posted.
	 * @param callback_getFoodPass: A callback function to return the result of the request.
	 */
	this.getFood = function(foodId, callback_getFood) {
		getFood(foodId, callback_getFood);
	}
}

/**
 * Get the pass to post a food.
 * @param callback_getFoodPass: A callback function to return the result of the request.
 */
function getPass(callback_getFoodPass) {
	var s3 = new aws.S3({
		accessKeyId: process.env.AMAZON_KEY,
	    secretAccessKey: process.env.AMAZON_SECRET_KEY,
	    region: process.env.AMAZON_REGION,
		apiVersion: 'lastest'
	});

	var imageId = (uuid.v4() + '-' + uuid.v4()).replace(/-/g, "");

	var params = {
		Bucket: process.env.S3_BUCKET, // Bucket Name
		Key:  imageId, // this generates a unique identifier
		Expires: 600, // number of seconds in which image must be posted - 10 minutes
		ContentType: 'image/png' // must match "Content-Type" header of Alamofire PUT request
	};

	s3.getSignedUrl('putObject', params, function(error, signedURL) {
		if (error) {
			console.log(error);
			callback_getFoodPass({status:503, message: "Service Disable"});
		} else {
			callback_getFoodPass(null, {postURL: signedURL, getURL: signedURL.split("?")[0]});
		}
	});
}


/**
 * Create object Food.
 * @param food: Food to be store.
 * @param callback_createFood: A callback function to return the result of the request.
 */
function create(cooker, food, coordinate, callback_createFood) {

	try {
		var foodId = uuid.v4();
		var timestamp = new Date().toString();

		var foodString = {
			"foodId": foodId, 
			"cookerId": cooker.cooker_id, 
			"name": food.name, 
			"description": food.description,
			"foodType": food.foodType,
			"ingredients": food.ingredients,
			"quantity": food.quantity,
			"price": food.price,
			"image": food.image,
			"expiration_date": food.expiration_date,
			"timestamp": timestamp,
			"location" : { 
				type: "Point", 
				coordinates: [ 
					coordinate.longitude, 
					coordinate.latitude 
				] 
			}
		};

		noSQLConnection.insert(process.env.FOOD_ON_DEMAND_COLLECTION, foodString, function(error, result) {
			if(error) {
				callback_createFood(error);
			} else {
				callback_createFood(null, {id: foodId});
			}
		});

	} catch(e) {
		console.log(e);
		callback_createFood(e);
	}
}

function getFoods(coordinate, callback_getFoods) {
	var coordinate = {
		"latitude": coordinate.latitude,
		"longitude": coordinate.longitude,
		"miles": coordinate.miles
	};

	var limit = { 
		_id: 0,
		cookerId: 0,
		ingredients: 0
	}

	noSQLConnection.findLocation(process.env.FOOD_ON_DEMAND_COLLECTION, coordinate, limit, function(error, result) {
		if(error) {
			callback_getFoods(error);
		} else {
			callback_getFoods(null, result);
		}
	});
}


function getFood(foodId, callback_getFood) {
	var foodString = {
		"foodId": foodId
	};

	var limit = { 
		_id: 0,
		cookerId: 0
	}

	noSQLConnection.find(process.env.FOOD_ON_DEMAND_COLLECTION, foodString, limit, function(error, result) {
		if(error) {
			callback_getFood(error);
		} else {
			callback_getFood(null, result);
		}
	});
}


function getCoordinate(cooker, callback_getCoordinate) {

	var options = {
		provider: 'google',
		httpAdapter: 'https',
		apiKey: process.env.GOOGLE_API_KEY,
		formatter: null
	};

	var geocoder = NodeGeocoder(options);

	geocoder.geocode({
		address: cooker.address1 + " " + cooker.address2 + " " + " " + cooker.city + cooker.province, 
		country: cooker.country, zipcode: cooker.postalCode
	}, function(error, res) {
		if(error) {
		  	callback_getCoordinate({status:503, message: "Service Disable"});
		} else {
			callback_getCoordinate(null, res[0]);
		}
	});
}
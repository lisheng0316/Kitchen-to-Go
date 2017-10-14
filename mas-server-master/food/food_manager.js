/**
 * This module handle the Food (CRUD Operations).
 * @author: Joel R. Corporan
 */

var uuid = require('uuid');

var noSQLConnection;

module.exports = function FoodManager(mongo) {

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
	this.createFood = function(userId, food, callback_createFood) {
		create(food, callback_createFood);
	}
}

/**
 * Get the pass to post a food.
 * @param callback_getFoodPass: A callback function to return the result of the request.
 */
function getPass(callback_getFoodPass) {
	var imageId = uuid.v4() + '-' + uuid.v4();

	var params = {
		Bucket: process.env.S3_BUCKET, // Bucket Name
		Key:  imageId, // this generates a unique identifier
		Expires: 600, // number of seconds in which image must be posted - 10 minutes
		ContentType: 'image/png' // must match "Content-Type" header of Alamofire PUT request
	};

	s3.getSignedUrl('putObject', params, function(err, signedURL) {
		if (err) {
			console.log(err);
			callback_getFoodPass(err);
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
function create(userId, food, callback_createFood) {

	try {
		var foodId = uuid.v4();
		var timestamp = new Date().toString();

		var foodString = {
			"food_id": foodId, 
			"user_id": userId, 
			"name": food.name, 
			"description": food.description,
			"ingredients": food.ingredients,
			"quantity": food.quantity,
			"price": food.price,
			"image": food.image,
			"timestamp": timestamp
		};

		noSQLConnection.insert(process.env.FOOD_ON_DEMAND_COLLECTION, foodString, function(error, result) {
			if(error) {
				callback_createFood(error);
			} else {
				callback_createFood(null, {id: foodId});
			}
		});

	} catch(e) {
		callback_createFood(error);
	}
}
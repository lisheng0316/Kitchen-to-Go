/**
 * User module is in charge of CRUD operations of a user.
 * @author Joel R. Corporan
 */

/**
 * Module Import
 */
var uuid = require('uuid');
var bcrypt = require('bcrypt');
var pgClient;

module.exports = function Users(database) {

	pgClient = database;

	/**
	 * This method handle the creation of a user.
	 * @param user: User to be created.
	 * @param callback_createUser: A callback function to return the result of the request.
	 */
	this.createUser = function(user, callback_createUser) {
		createSecureHash(user.password, function(error, secure) {
			if(error) {
				console.log(error);
				callback_createUser(error);
			} else {
				registerUser(user, secure, callback_createUser);
			}
		});
	}

	/**
	 * This method handle the creation of a cooker.
	 * @param user: User to become a cooker.
	 * @param callback_createCooker: A callback function to return the result of the request.
	 */
	this.createCooker = function(user, cooker, callback_createCooker) {
		registerCooker(user, cooker, callback_createCooker);
	}

	/**
	 * This method handle of getting of a user.
	 * @param userId: User to be created.
	 * @param callback_getUser: A callback function to return the result of the request.
	 */
	this.getUser = function(userId, callback_getUser) {
		getUser(userId, callback_getUser);
	}

	/**
	 * This method handle of getting of a cook.
	 * @param userId: User to be created.
	 * @param callback_getCook: A callback function to return the result of the request.
	 */
	this.getCook = function(userId, callback_getCook) {
		getCook(userId, callback_getCook);
	}

	/**
	 * Update user's information.
	 * @param update: Information to be updated.
	 * @param user: User information.
	 * @param callback_updateUser: A callback function to return the result of the request.
	 */
	this.updateUser = function(update, user, callback_updateUser) {}

	/**
	 * Update cooker's information.
	 * @param request: The upcoming request from the user.
	 * @param callback_updateCooker: Callback function to return the result of the request.
	 */
	this.updateCooker = function(update, user, cooker, callback_updateCooker) {}

}

/**
 * Create secure hash of password
 * @param password: User's password
 * @param callback_createSecureHash: Callback function to return the result of the request.
 */
function createSecureHash(password, callback_createSecureHash) {
	bcrypt.hash(password, 10, function(err, hash) {
	  	if(err) {
	  		console.log(err);
	  		callback_createSecureHash({status:503, message: "Service Disable"})
	  	} else {
	  		callback_createSecureHash(null, hash)
	  	}
	});
}

/**
 * Create User.
 * @param user: User information.
 * @param callback_registerUser: A callback function to return the result of the request.
 */
function registerUser(user, secure, callback_registerUser) {
	var userId = uuid.v4();

	const query = "INSERT INTO users (user_id, email, firstname, lastname, password, phone) VAlUES ($1, $2, $3, $4, $5, $6)"
	const values = [userId, user.email, user.firstName, user.lastName, secure, user.phone];

	pgClient.query(query, values, function(err, result) {
		if(!err) {
			callback_registerUser(null, {id:userId});
		}
		else {
			if(err.code === '23505') {
				callback_registerUser({status: 401, message: "User Already Stored"});
			} else {
				callback_registerUser({status: 500, message: "Unexpeted Error While Storing Object"});
			}
		}
	});
}

/**
 * Create Cooker.
 * @param user: User information.
 * @param cooker: Cooker information.
 * @param callback_registerCooker: A callback function to return the result of the request.
 */
function registerCooker(user, cooker, callback_registerCooker) {
	var cookerId = uuid.v4();

	const query = "INSERT INTO cooks (user_id, cooker_id, address1, address2, city, province, postalcode, country) VAlUES ($1, $2, $3, $4, $5, $6, $7, $8)"
	const values = [user.user_id, cookerId, cooker.address1, cooker.address2, cooker.city, cooker.province, cooker.postalCode, cooker.country];

	pgClient.query(query, values, function(error, result) {
		if(!error) {
			callback_registerCooker(null,  {id:cookerId});
		}
		else {
			if(error.code === '23505') {
				callback_registerCooker({status: 401, message: "User Already Stored"});
			} else {
				callback_registerCooker({status: 500, message: "Unexpeted Error While Storing Object"});
			}
		}
	});
}


/**
 * Get user.
 * @param email: User's email
 * @param callback_isUser: Callback function to return the result of the request.
 */
function getUser(userId, callback_getUser) {

	const query = "SELECT * FROM users WHERE user_id = $1"
	const values = [userId];

	pgClient.query(query, values, function(error, result) {
		if(error) {
			callback_getUser({status:503, message: "Service Disable"});
		} else {
			callback_getUser(null, {
				firstName: result.rows[0].firstname,
				lastName: result.rows[0].lastname,
				email: result.rows[0].email,
				phone: result.rows[0].phone
			});
		}
	});
}

/**
 * Get user.
 * @param email: User's email
 * @param callback_getCook: Callback function to return the result of the request.
 */
function getCook(userId, callback_getCook) {

	const query = "SELECT * FROM cooks WHERE user_id = $1"
	const values = [userId];

	pgClient.query(query, values, function(error, result) {
		if(error) {
			callback_getCook({status:503, message: "Service Disable"});
		} else {
			callback_getCook(null, {
				address1: result.rows[0].address1,
				address2: result.rows[0].address2,
				city: result.rows[0].city,
				province: result.rows[0].province,
				postalcode: result.rows[0].postalcode,
				country: result.rows[0].country
			});
		}
	});
}
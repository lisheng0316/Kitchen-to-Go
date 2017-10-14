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

module.exports = function User(database) {

	pgClient = database;

	/**
	 * This method handle the creation of a user.
	 * @param user: User to be created.
	 * @param callback_createUser: A callback function to return the result of the request.
	 */
	this.createUser = function(user, callback_createUser) {
		createSecureHash(user.password, function(error, secure) {
			if(error) {
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
	 * @param callback_createUser: A callback function to return the result of the request.
	 */
	this.getUser = function(userId, callback_getUser) {
		getUser(userId, callback_getUser);
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
	bcrypt.hash(password, saltRounds, function(err, hash) {
	  	if(err) {
	  		callback_createSecureHash(err)
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

	const query = "INSERT INTO users (userId, email, firstName, lastName, password, phone) VAlUES ($1, $2, $3, $4, $5, $6)"
	const values = [userId, user.email, user.firstName, user.lastName, secure, user.phone];

	pgClient.query(query, values, function(err, result) {
		if(!err) {
			callback_registerUser(null);
		}
		else {
			callback_registerUser(err, {id:userId});
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

	const query = "INSERT INTO users (userId, cookerId, address1, address2, city, province, postalCode, country) VAlUES ($1, $2, $3, $4, $5, $6, $7, $8)"
	const values = [user.userId, cookerId, cooker.address1, cooker.address2, cooker.city, cooker.province, cooker.postalCode, cooker.country];

	pgClient.query(query, values, function(err, result) {
		if(!err) {
			callback_registerCooker(null);
		}
		else {
			callback_registerCooker(err, {id:cookerId});
		}
	});
}


/**
 * Get user.
 * @param email: User's email
 * @param callback_isUser: Callback function to return the result of the request.
 */
function getUser(userId, callback_getUser) {

	const query = "SELECT * FROM users WHERE userId = $1"
	const values = [userId];

	pgClient.query(query, values, function(err, result) {
		if(!err) {
			callback_getUser(err);
		} else {
			callback_getUser(null, {
				userId: result.rows[0].userId,
				firstName: result.rows[0].firstName,
				lastName: result.rows[0].lastName,
				email: result.rows[0].email,
				phone: result.rows[0].phone
			});
		}
	});
}
/**
 * User module is in charge of handling sessions.
 * @author Joel R. Corporan
 */

/**
 * Module Import
 */
var uuid = require('uuid');
var bcrypt = require('bcrypt');
var pgClient;

module.exports = function Session(database) {

	pgClient = database;

	/**
	 * This method handle the creation af a session.
	 * @param userId: Identifier of User.
	 * @param callback_setSession: A callback function to return the result of the request.
	 */
	this.setSession = function(user, password, callback_setSession) {
		checkIfSecure(password, user.password, function(error, isKnown) {
			if(error) {
				callback_setSession({status: 503, message: 'Service Disable'});
			} else {
				if(isKnown) {
					createSession(user.userId, callback_setSession);
				} else {
					callback_setSession({status: 404, message: 'user/password not found'})
				}
			}
		});
	}

	/**
	 * This method handle the removal of a session.
	 * @param userId: Identifier of User.
	 * @param callback_removeSession: A callback function to return the result of the request.
	 */
	this.removeSession = function(userId, token, callback_removeSession) {
		removeSession(userId, token, callback_removeSession);
	}

}

/**
 * Check if password is valid
 * @param password: User's password
 * @param hash: Store hash password
 * @param callback_checkIfSecure: Callback function to return the result of the request.
 */
function checkIfSecure(password, hash, callback_checkIfSecure) {
	bcrypt.compare(password, hash, function(err, valid) {
	    if(err) {
	  		callback_checkIfSecure(err)
	  	} else {
	  		callback_checkIfSecure(null, valid)
	  	}
	});
}

/**
 * Create Session.
 * @param user: User information.
 * @param callback_createSession: A callback function to return the result of the request.
 */
function createSession(userId, callback_createSession) {
	var session = new Date().toString();
	var token = uuid.v4() + '-' + uuid.v4() + '-' + uuid.v4() + '-' + uuid.v4();

	const query = "INSERT INTO session (userId, token, session_time) VAlUES ($1, $2, $3)"
	const values = [userId, token, session];

	pgClient.query(query, values, function(err, result) {
		if(!err) {
			callback_createSession(null, {token:token});
		}
		else {
			callback_createSession(null, {token:token});
		}
	});
}

/**
 * Remove Session.
 * @param user: User information.
 * @param token: User session token.
 * @param callback_removeSession: A callback function to return the result of the request.
 */
function removeSession(userId, token, callback_removeSession) {

	const query = "DELETE FROM users WHERE userId = $1 AND token SET token = $2"
	const values = [userId, token];

	pgClient.query(query, values, function(err, result) {
		if(!err) {
			callback_removeSession(null);
		}
		else {
			callback_removeSession(err);
		}
	});
}
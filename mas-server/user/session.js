/**
 * User module is in charge of handling sessions.
 * @author Joel R. Corporan
 */

/**
 * Module Import
 */
var uuid = require('uuid');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var pgClient;

module.exports = function Session(database) {

	pgClient = database;

	/**
	 * This method handle the creation af a session.
	 * @param userId: Identifier of User.
	 * @param callback_setSession: A callback function to return the result of the request.
	 */
	this.setSession = function(user, credentials, callback_setSession) {
		checkIfSecure(credentials.password, user.password, function(error, isKnown) {
			if(error) {
				callback_setSession({status: 503, message: 'Service Disable'});
			} else {
				if(isKnown) {
					createSession(user.user_id, callback_setSession);
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
	this.removeSession = function(userid, token, callback_removeSession) {
		removeSession(userid, token, callback_removeSession);
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
	    	console.log(err)
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
	var token = uuid.v4();

	var token = jwt.encode({ token: userId + ":" + token }, process.env.JWT_SECRET);

	const query = "INSERT INTO sessions (user_id, token, session_time, device_id) VAlUES ($1, $2, $3, $4)"
	const values = [userId, token, session, ""];

	pgClient.query(query, values, function(error, result) {
		if(!error) {
			callback_createSession(null, {token: token});
		}
		else {
			console.log(error)
			callback_createSession({status: 503, message: 'Service Disable'});
		}
	});
}

/**
 * Remove Session.
 * @param user: User information.
 * @param token: User session token.
 * @param callback_removeSession: A callback function to return the result of the request.
 */
function removeSession(userid, token, callback_removeSession) {

	// var decodeToken = jwt.decode(token, process.env.JWT_SECRET).userId.split(':')[0];

	const query = "DELETE FROM sessions WHERE user_id = $1 AND token = $2"
	const values = [userid, token];

	pgClient.query(query, values, function(err, result) {
		if(!err) {
			callback_removeSession(null, result);
		}
		else {
			callback_removeSession({status: 503, message: 'Service Disable'});
		}
	});
}
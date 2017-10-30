/*
 * This module is use to check if user's token still alive.
 */
exports.session = function(db) {
	var pgClient = db;
	return function(req, res, next) {
		var cookie = getCookie(req.headers.cookie) || req.headers['x-token-api'];

		pgClient.query("SELECT * FROM users NATURAL JOIN sessions WHERE token = $1", [cookie], function(err, result) {
			try {
				if(!err) {
					if(!result.rowCount <= 0) {
						const t1 = new Date(result.rows[0].session_time);
						const t2 = new Date();
						const timeDifferent = Math.abs(t2 - t1);

						// If the user have been inactive for more than 672 hours has, it has to begin a new session
						if (timeDifferent > 2419000000) {

							var query = "DELETE FROM sessions WHERE token = $1"
							var value = [cookie]
							
							pgClient.query(query, value, function(error, result2) {
								try {
									if(!error) {
										res.status(403).send('Method not allowed. Session required');
									}
									else {
										res.status(503).send('Service Disable');
									}
								}
								catch(catch_error2) {
									res.status(500).send('Server Error');
								}
							});
						}
						
						// If the user have been inactive for less that 672 hours, the session time will restset.
						else {
							var session = new Date().toString();
							var query = "UPDATE sessions SET session_time = $1 WHERE token = $2"
							var value = [session, cookie]
							
							pgClient.query(query, value, function(error, result3) {
								try {
									if(!error) {
										req.params.user = result.rows[0];
										req.params.token = cookie;
										res.cookie(process.env.SESSION_COOKIE, cookie, { expires: new Date(Date.now() + 672 * 1000 * 60 * 60)});
										next();
									}
									else {
										res.status(500).send('Server Error');
									}
								}
								catch(catch_error3) {
									res.status(500).send('Server Error');
								}
							});
						}
					}
					else {
						res.status(403).send('Method not allowed. Session required');
					}
				}
				else {
					res.status(500).send('Server Error');
				}
			}
			catch(catch_error1) {
				res.status(500).send('Server Error');
			}
		});
	}
}

exports.isCooker = function(db) {
	var pgClient = db;
	return function(req, res, next) {
		const query = "SELECT * FROM cooks WHERE user_id = $1"
		const values = [req.params.user.user_id];

		pgClient.query(query, values, function(error, result) {
			if(error) {
				res.status(503).send('Service Disable');
			} else {
				if(!result.rowCount <= 0) {
					req.params.user.isCooker = true;
					req.params.cooker = result.rows[0];
					next();
				} else {
					res.status(401).send("User not allowed");
				}
			}
		});
	}
}

/**
 * Get Cookie Session.
 * @param cookie: Session Identifier.
 */
function getCookie(cookie) {
	var value = "; " + cookie;
	var parts = value.split("; " + process.env.SESSION_COOKIE + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}
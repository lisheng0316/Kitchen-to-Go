/*
 * This module is use to check if user's token still alive.
 */
module.exports = function(db) {
	var pgClient = db;
	return function(req, res, next) {
		var cookie = getCookie(req.headers.cookie);
		var user_agent = req.headers['user-agent'] + " " + req.device.type;

		pgClient.query("SELECT * FROM monkie_user WHERE token = $1", [cookie], function(err, result) {
			try {
				if(!err) {
					if(!result.rowCount <= 0) {
						const t1 = new Date(result.rows[0].session_time);
						const t2 = new Date();
						const timeDifferent = Math.abs(t2 - t1);

						// If the user have been inactive for more than 2.5 hours has, it has to begin a new session
						if (timeDifferent > 9000000) {

							var query = "UPDATE monkie_user SET token = NULL, credentials = NULL, session_time = NULL WHERE email = $1"
							var value = [result.rows[0].email]
							
							pgClient.query(query, value, function(error, result2) {
								try {
									if(!error) {
										send_login(res);
									}
									else {
										res.status(500).render('500');
									}
								}
								catch(catch_error2) {
									res.status(500).render('500');
								}
							});
						}
						
						// If the user have been inactive for less that 2.5 hours, the session time will restset.
						else {
							var user_agent_ascii = new Buffer(result.rows[0].user_agent, 'base64').toString('ascii');
							if(user_agent_ascii === user_agent) {
								var session = new Date().toString();
								var query = "UPDATE monkie_user SET session_time = $1 WHERE token = $2"
								var value = [session, cookie]
								
								pgClient.query(query, value, function(error, result3) {
									try {
										if(!error) {
											req.params.credentials = result.rows[0].credentials;
											req.params.email = result.rows[0].email;
											req.params.user_id = result.rows[0].user_id;
											req.params.cookie = cookie;
											res.cookie(process.env.SESSION_COOKIE, cookie, { expires: new Date(Date.now() + 2.5 * 1000 * 60 * 60)});
											next();
										}
										else {
											res.status(500).render('500');
										}
									}
									catch(catch_error3) {
										res.status(500).render('500');
									}
								});
							}
							else {
								send_login(res)
							}
						}
					}
					else {
						send_login(res);
					}
				}
				else {
					next();
					res.status(500).render('500');
				}
			}
			catch(catch_error1) {
				res.status(500).render('500');
			}
		});
	}

	function getCookie(cookie) {
		var value = "; " + cookie;
    	var parts = value.split("; " + "adultswim_pr" + "=");
    	if (parts.length == 2) return parts.pop().split(";").shift();
	}
}

/**
 * Return to login page.
 * @param response: Route to response the device.
 */
function send_login(response) {
	response.locals = null;
	response.status(403).render('login');
}
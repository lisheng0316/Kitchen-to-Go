/**
 * ResquestHandler module is in charge of handling all the requests received.
 * @author Joel R. Corporan
 */

/**
 * Module Import
 */
// var SessionManager = require('../session/userSessionManager.js');
// var ProjectsManager = require('../projects/projectsManager.js')
// var VideoManager = require('../projects/videoManager.js');
// var MailManager = require('../mail/mailManager.js')

module.exports = function ResquestHandler(SQLDatabase, noSQLDatabase) {

	var sqlConnection = SQLDatabase;
	var NoSQLConnection = noSQLDatabase;

	/**
	 * Handler the user's session.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handleUserSession = function(req, res) {
		try {
			if(Object.keys(req.params).length === 0) {
				error_500_text(res);
			}
			else {
				var request = req.params;

				var session = new SessionManager(sqlConnection);
				session.userSessionHandler(request, function(error, found) {
					if(error) {
						error_500_text(res);
					}
					else {
						res.cookie(process.env.SESSION_COOKIE, found.token, { expires: new Date(Date.now() + 2.5 * 1000 * 60 * 60)});
						res.send({success: 1});
					}
				});
			}
		}
		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Handler the user's session.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handleUserMusicSession = function(req, res) {
		try {
			if(Object.keys(req.params).length === 0) {
				error_500_text(res);
				
			} else {
				var request = req.params;

				var session = new SessionManager(sqlConnection);
				session.userMusicSessionHandler(request, function(error, found) {
					if(error) {
						error_500_text(res);
					}
					else {
						res.cookie(process.env.MUSIC_SESSION_COOKIE, found.token, { expires: new Date(Date.now() + 2.5 * 1000 * 60 * 60)});
						res.send({success: 1});
					}
				});
			}
		}
		catch(error) {
			console.log("here:", error)
			error_500_text(res);
		}
	}

	/**
	 * Handler the user's request
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handleEmailRequest = function(req, res) {
		try {
			var values = JSON.parse(req.headers['requester-values']);
			
			if(Object.keys(values).length === 0) { 
				error_500_text(res);
			}
			else {
				MailManager.sendNotification(values, NoSQLConnection, function(error, result) {
					if(error) {
						res.status(409).send({success:0});
					}
					else {
						res.status(201).send({success:1});
					}
				});
			}
		}
		catch(error) {
			error_500_text(500);
		}
	}

	/**
	 * Handler the ending of a user'ssession.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handleCloseSession = function(req, res) {
		try {
			var request = req.headers.cookie;

			var session = new SessionManager(sqlConnection);
			session.closeSessionHandler(request, function(error, found) {
				if(error) {
					error_500_text(res);
				}
				else {
					res.send({success:found.success});
				}
			});
		}
		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Handler the passwor change from the user.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	 this.handleUpdatePassword = function(req, res, next) {
	 	try {
	 		if(Object.keys(req.params).length === 0) {
				error_500_text(res);
			}
			else {
				var request = req.params;

				var newPassword = new Buffer(req.headers.newpassword, 'base64').toString('ascii');
				var session = new SessionManager(sqlConnection);
				session.updatePasswordHandler(request, newPassword, function(error, found) {			
					if(error) {
						if(error.status == 403) {
							send_login(res);
						}
						else if(error.status == 404) {
							error_404_html(res)
						}
						else {
							error_500_html(res);
						}
					}
					else {
						req.params.credentials = found;
						next()
					}
				});
			}
	 	}
	 	catch(error) {
	 		error_500_text(res);
	 	}
	 }

	/**
	 * Handler the information of the user.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 * @param next: Route to anothe method.
	 */
	this.handleUserInfo = function(req, res, next) {
		try {
			if(Object.keys(req.params).length === 0) {
				error_500_html(res);
			}
			else {
				var credentials = req.params.credentials;
		
				var session = new SessionManager(sqlConnection);
				session.userInfoHandler(credentials, function(error, found) {
					if(error) {
						if(error.status == 403 || error.status == 401) {
							req.params.isInfo = false;
							next();
						}
						else {
							error_500_html(res);
						}
					}
					else {
						req.params.isInfo = true;
						req.params.userInfo = found;
						res.locals.auth = found;
						next();
					}
				});
			}
		}
		catch(error) {
			error_500_html(res);
		}
	}

	/**
	 * Handler the projects.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 * @param next: Route to anothe method.
	 */
	this.handleProjects = function(req, res, next) {
		try {
			if(Object.keys(req.params).length === 0) {
				error_500_html(res);
			}
			else {
				var credentials = req.params.credentials;

				var project = new ProjectsManager();
				project.projectsHandler(credentials, function(error, projects) {
					if(error) {
						if(error.status == 403 || error.status == 401) {
							req.params.isProject = false;
							next();
						}
						else if(error.status == 404) {
							req.params.isProject = true;
							next();
						}

						else {
							console.log("Trigger 500 on Project: ", error);
							error_500_html(res);
						}
					}
					else {
						req.params.isProject = true;
						res.locals.shows = projects;
						next();
					}
				});
			}
		}
		catch(error) {
			error_500_html(res);
		}
	}

	/**
	 * Handler the assets by name attached to a project.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 * @param next: Route to anothe method.
	 */
	this.handleAssets = function(req, res, next) {
		try {
			if(Object.keys(req.params).length === 0) {
				error_500_html(res);
			}
			else {
				var credentials = req.params.credentials;
				var projectName = req.params.show;

				var project = new ProjectsManager();
				project.assetsHandler(credentials, projectName, function(error, assets) {
					if(error) {
						if(error.status == 403) {
							send_login(res);
						}
						else if(error.status == 404) {
							error_404_html(res)
						}
						else {
							error_500_html(res);
						}
					}
					else {

						projectTagId = null;
						if(req.params.userInfo.tags.length > 0) {
							req.params.userInfo.tags.forEach(function(tag) {
								if(assets.projectId == tag.split(':')[0]) {
									projectTagId = tag;
								}
							});
						} else {
							res.locals.VIDEO_AVAILABLE = true;
							res.locals.IMAGE_AVAILABLE = true;
						}

						if(projectTagId != null) {
							res.locals.VIDEO_AVAILABLE = projectTagId.split(':')[1] === 'true' ? true : false;
							res.locals.IMAGE_AVAILABLE = projectTagId.split(':')[2] === 'true' ? true : false;
						}

						res.locals.videos = new Array();
						res.locals.images = new Array();

						assets.forEach(function(asset) {
							if(asset.type === 'video') {
								res.locals.videos.push(asset);
							}
							else if(asset.type === 'image') {
								res.locals.images.push(asset);
							}

							else if (asset.type === 'archive') {
								if(req.device.type === 'desktop') {
									res.locals.resources = asset.derivatives[0].url;
								}
							}

						});

						if(assets.showName !== null || assets.showName !== undefined) {
							res.locals.showNameTop = assets.showName;
						}

						if (Object.keys(res.locals.images).length === 0) {
							res.locals.IMAGE_AVAILABLE = false;
						}

						if (Object.keys(res.locals.videos).length === 0) {
							res.locals.VIDEO_AVAILABLE = false;
							next();

						} else {
							if(!res.locals.videos[0].watermarked) {
								res.locals = null
								res.render('404');
							} else {
								next();
							}
						}
					}
				});
			}
		}

		catch(error) {
			error_500_html(res);
		}
	}

	/**
	 * Handler the resource of the project.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 * @param next: Route to anothe method.
	 */
	this.handleResource = function(req, res, next) {
		try {
			if(Object.keys(req.params).length === 0) {
				error_500_html(res);
			}
			else {
				var credentials = req.params.credentials;
				var projectName = new Buffer(req.headers.show, 'base64').toString('ascii');

				var project = new ProjectsManager();
				project.resourceHandle(credentials, projectName, function(error, resource) {
					if(error) {
						error_500_text(res);
					}
					else {
						req.params.toEncrypt = {resource:resource[0].derivatives[0].url};
						next();
					}
				});
			}
		}

		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Get the description of the show (e.g. About) ************ NOT IN USE ***************
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 * @param next: Route to anothe method.
	 */
	this.handleAssetsDescription = function(req, res, next) {
		try {
			if(Object.keys(req.params).length === 0) {
				error_500_html(res);
			}
			else {
				var projectName = req.params['0'].split('.')[0];

				var project = new ProjectsManager();
				project.assetsDescriptionHandler(projectName, NoSQLConnection, function(error, assetsDescription) {
					if(error) {
						if(error.status == 403) {
							send_login(res);
						}
						else if(error.status == 404) {
							error_404_html(res)
						}
						else {
							error_500_html(res);
						}
					}
					else {
						if(Object.keys(assetsDescription).length === 0) {
							res.locals.about = null;
						}
						else {
							res.locals.about = assetsDescription[0];
						}
						next();
					}
				});
			}
		}

		catch(error) {
			error_500_html(res);
		}
	}

	/**
	 * Handler video asset from an specific project to the user.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handleAssetRequest = function(req, res) {
		try {
			var request = req.params;
			var assetId = req.query.id;

			var videoAsset = new VideoManager(sqlConnection, NoSQLConnection);
			videoAsset.prepareAssetHandler(request, assetId, function(err, found) {
				if(err) {
					error_500_text(res);
				}
				else {
					res.send(found)
				}
			});
		}
		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Handler the video to the user.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.handleVideo = function(req, res) {
		try {
			videoToken = req.query.id;
		
			var videoAsset = new VideoManager(sqlConnection, NoSQLConnection);
			videoAsset.videoAssetHandler(videoToken, res);
		}
		catch(error) {
			error_500_text(res);
		}
	}
}

/**
 * Return a HTTP 500 code to the user.
 * @param response: Route to response the device.
 */
function error_500_text(response) {
	response.status(500).send("Unexpected Error");
}

/**
 * Return a HTTP 500 page to the user.
 * @param response: Route to response the device.
 */
function error_500_html(response) {
	response.locals = null;
	response.status(500).render('500');
}

/**
 * Return a HTTP 404 page to the user.
 * @param response: Route to response the device.
 */
function error_404_html(response) {
	response.locals = null;
	response.status(404).render('404');
}

/**
 * Return to login page.
 * @param response: Route to response the device.
 */
function send_login(response) {
	response.locals = null;
	response.status(403).render('login');
}


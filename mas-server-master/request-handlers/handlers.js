/**
 * ResquestHandler module is in charge of handling all the requests received.
 * @author Joel R. Corporan
 */

/**
 * Module Import
 */
var FoodManager = require('../food/food_manager.js');
var User = require('../users/user.js');

module.exports = function ResquestHandler(SQLDatabase, noSQLDatabase) {

	var sqlConnection = SQLDatabase;
	var NoSQLConnection = noSQLDatabase;

	/**
	 * Handler the creation of a session.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.createSession = function(req, res) {
		try {
			var session = new Session(sqlConnection);
			session.setSession(function(error, found) {
				if(error) {
					error_500_text(res);
				}
				else {
					res.cookie(process.env.SESSION_COOKIE, found.token, { expires: new Date(Date.now() + 672 * 1000 * 60 * 60)});
					res.status(204).send();
				}
			});
		}
		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Handler the creation of a session.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.removeSession = function(req, res) {
		try {
			var session = new Session(sqlConnection);
			session.removeSession(function(error, found) {
				if(error) {
					error_500_text(res);
				}
				else {
					res.status(204).send();
				}
			});
		}
		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Handler the creation of a user.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.createUser = function(req, res) {
		try {
			var user = new User(sqlConnection);
			user.createUser(function(error, found) {
				if(error) {
					error_500_text(res);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Handler the creation of a cooker.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.createCooker = function(req, res) {
		try {
			var user = new User(sqlConnection);
			user.createCooker(function(error, found) {
				if(error) {
					error_500_text(res);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Handler the getting of a user.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.getUser = function(req, res) {
		try {
			var user = new User(sqlConnection);
			user.getUser(function(error, found) {
				if(error) {
					error_500_text(res);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Handler the permission to post a food.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.getFoodUploadPass = function(req, res) {
		try {
			var food = new FoodManager();
			food.getFoodPass(function(error, found) {
				if(error) {
					error_500_text(res);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Handler the posting of a food.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.createFood = function(req, res) {
		try {
			var request = req.headers.cookie;

			var food = new FoodManager();
			food.createFood(request, function(error, found) {
				if(error) {
					error_500_text(res);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			error_500_text(res);
		}
	}

	/**
	 * Handler the posting of a food.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.getFood = function(req, res) {
		try {
			var request = req.headers.cookie;

			var food = new FoodManager();
			food.createFood(request, function(error, found) {
				if(error) {
					error_500_text(res);
				}
				else {
					res.send(found);
				}
			});
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


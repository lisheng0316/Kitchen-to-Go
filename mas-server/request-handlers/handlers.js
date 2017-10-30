/**
 * ResquestHandler module is in charge of handling all the requests received.
 * @author Joel R. Corporan
 */

/**
 * Module Import
 */
var Foods = require('../food/foods.js');
var Users = require('../user/users.js');
var Session = require('../user/session.js');

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
			var credentials = {email: req.headers.email, password: req.headers.password};

			var session = new Session(sqlConnection);
			session.setSession(req.params.user, credentials, function(error, found) {
				if(error) {
					console.log(error);
					res.status(error.status).send(error.message);
				}
				else {
					res.cookie(process.env.SESSION_COOKIE, found.token, { expires: new Date(Date.now() + 672 * 1000 * 60 * 60)});
					res.status(201).send(found);
				}
			});
		}
		catch(error) {
			console.log(error);
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
			session.removeSession(req.params.user.user_id, req.params.token, function(error, found) {
				if(error) {
					console.log(error);
					res.status(error.status).send(error.message);
				}
				else {
					res.cookie(process.env.SESSION_COOKIE, found.token, { expires: new Date(Date.now() + -672 * 1000 * 60 * 60)});
					res.status(204).send();
				}
			});
		}
		catch(error) {
			console.log(error);
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

			var userInfo = req.body;

			var user = new Users(sqlConnection);
			user.createUser(userInfo, function(error, found) {
				if(error) {
					console.log(error);
					res.status(error.status).send(error.message)
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			console.log(error);
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

			var cookerInfo = req.body;

			var user = new Users(sqlConnection);
			user.createCooker(req.params.user, cookerInfo, function(error, found) {
				if(error) {
					console.log(error);
					res.status(error.status).send(error.message);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			console.log(error);
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
			var user = new Users(sqlConnection);
			user.getUser(req.params.user.user_id, function(error, found) {
				if(error) {
					console.log(error);
					res.status(error.status).send(error.message);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			console.log(error);
			error_500_text(res);
		}
	}

	/**
	 * Handler the getting of a cook.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.getCook = function(req, res) {
		try {
			var user = new Users(sqlConnection);
			user.getCook(req.params.user.user_id, function(error, found) {
				if(error) {
					console.log(error);
					res.status(error.status).send(error.message);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			console.log(error);
			error_500_text(res);
		}
	}

	/**
	 * Handler the permission to post a food.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.getPass = function(req, res) {
		try {
			var food = new Foods();
			food.getFoodPass(function(error, found) {
				if(error) {
					console.log(error);
					res.status(error.status).send(error.message);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			console.log(error);
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
			var cooker = req.params.cooker;
			var foodInfo = req.body;

			var food = new Foods(NoSQLConnection);
			food.createFood(cooker, foodInfo, function(error, found) {
				if(error) {
					console.log(error);
					res.status(error.status).send(error.message);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			console.log(error);
			error_500_text(res);
		}
	}

	/**
	 * Handler the food with a single id.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.getFoods = function(req, res) {
		try {
			var coordinate = req.params.coordinate;

			var food = new Foods(NoSQLConnection);
			food.getFoods(coordinate, function(error, found) {
				if(error) {
					console.log(error);
					res.status(error.status).send(error.message);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			console.log(error);
			error_500_text(res);
		}
	}


	/**
	 * Handler the food with a single id.
	 * @param req: Request from the device.
	 * @param res: Route to response the device.
	 */
	this.getFood = function(req, res) {
		try {
			var foodId = req.params.id;

			var food = new Foods(NoSQLConnection);
			food.getFood(foodId, function(error, found) {
				if(error) {
					console.log(error);
					res.status(error.status).send(error.message);
				}
				else {
					res.send(found);
				}
			});
		}
		catch(error) {
			console.log(error);
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


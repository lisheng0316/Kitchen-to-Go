/*
 * This module received all requests and give them to its respective handler.
 * @author: Joel R. Corporan
 */

var validator = require('./validator.js');
var authorize = require('./authorize.js');

module.exports = function Route(app, handlers, db, noSQLDB) {

	// Create Session
	app.post('/session', validator.session(db), handlers.createSession);

	// Remove Session
	app.delete('/session', authorize.session(db), handlers.removeSession);

	// Create user
	app.post('/users', validator.user, handlers.createUser);

	// Get user
	app.get('/users', authorize.session(db), handlers.getUser);

	// Create cooker
	app.post('/cookers', authorize.session(db), validator.cooker, handlers.createCooker);

	// Get cooker
	app.get('/cookers', authorize.session(db), authorize.isCooker(db), handlers.getCook);

	// Get pass to post food (S3 Signed URL Inlcuded)
	app.get('/pass', authorize.session(db), authorize.isCooker(db), handlers.getPass);

	// Create food
	app.post('/foods', authorize.session(db), authorize.isCooker(db), validator.food, handlers.createFood);

	// Get foods over a certain location.
	app.get('/foods/:latitude?/:longitude?/:miles?', authorize.session(db), validator.getFoods, handlers.getFoods);

	// Get food
	app.get('/food/:id', authorize.session(db), validator.id, handlers.getFood);

	// 404 Handler
	app.use(function(req, res, next) {
		res.status(404).send('Not Found');
	});
};

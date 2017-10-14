/*
 * This module received all requests and give them to its respective handler.
 * @author: Joel R. Corporan
 */

var validator = require('./validator.js');
var authorize = require('./authorize.js');

module.exports = function Route(app, handlers, db, noSQLDB) {

	// Create Session
	app.post('/session', validate.session(db), handlers.createSession)

	// Remove Session
	app.delete('/session', validate.session(db), handlers.removeSession)

	// Create user
	app.post('/users', validator.user, handlers.createUser);

	// Get user
	app.get('/users/:id', authorize(db), validator.id, handlers.getUser);

	// Create cooker
	app.post('/cookers/:id', authorize(db), validator.id, function(req, res) {
		res.send("foods");
	});

	// This route handler user's session.
	app.get('/foods', function(req, res) {
		res.send("foods");
	});

	// This route handler user's session.
	app.get('/foods/:id', function(req, res) {
		res.send("foods");
	});

	app.patch('/foods', function(req, res) {
		
	});

	app.post('/foods', validator.food, function(req, res) {

	})

	app.use(function(req, res, next) {
		res.status(404).send('Not Found');
	});
};

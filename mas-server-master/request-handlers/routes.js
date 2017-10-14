/*
 * This module received all requests and give them to its respective handler.
 * @author: Joel R. Corporan
 */
module.exports = function Route(app, handlers, db, noSQLDB) {


	var foods = [{
					"id": "f84b93aa-a37c-49a0-9c8a-732bc0cb02b1",
					"type": "asian",
					"name": "Rice Bowl",
					"rating": 4,
					"image" : "https://i.imgur.com/eTuCPxM.jpg"
				},
				{
					"id": "f84b93aa-a37c-49a0-9c8a-732bc0cb02b1",
					"type": "sandwiches",
					"name": "Sandwich",
					"rating": 3,
					"image" : "https://i.imgur.com/bE4jFyr.jpg"
				},
				{
					"id": "f84b93aa-a37c-49a0-9c8a-732bc0cb02b1",
					"type": "breakfast",
					"name": "American Breakfast",
					"rating": 5,
					"image" : "https://i.imgur.com/3ghyDQJ.jpg"
				},
				{
					"id": "f84b93aa-a37c-49a0-9c8a-732bc0cb02b1",
					"type": "asian",
					"name": "Dumplings",
					"rating": 2.0,
					"image" : "https://i.imgur.com/yDD0LCR.jpg"
				}];

	// This route handler user's session.
	app.get('/foods', function(req, res) {
		res.send(foods);
	});

	// This route handler user's session.
	app.get('/foods/:id', function(req, res) {
		res.send(foods.find(function(food) {
			return food.id = req.params.id;
		}));
	});

	app.use(function(req, res, next) {
		res.status(404).send('Not Found');
	});
};

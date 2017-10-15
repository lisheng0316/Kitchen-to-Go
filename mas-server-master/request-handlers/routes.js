/*
 * This module received all requests and give them to its respective handler.
 * @author: Joel R. Corporan
 */
const fs = require('fs');

module.exports = function Route(app, handlers, db, noSQLDB) {
	
	const user = {"name": "Randy Random",
				"age": 24
				};
/* 	var foods = [{
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
				}]; */
	
	// Routes to index.ejs
	app.get('/', function(req, res) {
		console.log("test");
		foods = [];
        foodPath = 'mas-server-master/dummy_data/foods.json';
        if (fs.existsSync(foodPath)) {
            foods = JSON.parse(fs.readFileSync(foodPath));
        }
        console.log(foods);
		data = {
			user: user,
			foods: foods
		};
		res.render('index', data);
	});

	// Jiwon stuff
	// app.get('/foods/:id', function(req, res) {
		// res.send(foods.find(function(food) {
			// return food.id = req.params.id;
		// }));
	// });
	
	app.get('/postfood', function(req, res) {
		data = {
			user: user
		};
		res.render('postfood', data);
	});
	
	app.post('/postfood', function(req, res) {
		foods = [];
		foodPath = 'dummy_data/foods.json';
		if (fs.existsSync(foodPath)) {
			foods = JSON.parse(fs.readFileSync(foodPath));
		}

		newFood = {
			type: req.body.foodtype,
			name: req.body.dishname,
			rating: null /* TODO */,
			availableFrom: (new Date()).toISOString(),
			image: '' /* TODO */
		};

		foods.push(newFood);

		fs.writeFileSync(foodPath, JSON.stringify(foods));

		res.redirect('/');
	});

	app.use(function(req, res, next) {
		res.status(404).send('Not Found');
	});
};

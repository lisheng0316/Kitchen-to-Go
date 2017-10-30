/**
 * Creates the server, listen for requests and routes
 * the request for its respective handler.
 * @author: Joel R. Corporan
 */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var helmet = require('helmet');

var config = require('./config/config.js');
var routes = require('./request-handlers/routes.js');
var RequestHandlers = require('./request-handlers/handlers.js');
var Database = require('./database/databaseManager.js');
var noSQLDatabase = require('./database/mongoManager.js');

var app = express();

// Connection URLs for Databases.
var SQLconnection = config.SQL_DATABASE;
var NoSQLconnection = config.NOSQL_DATABASE;

// Initializing Databse
var SQLdb = new Database(SQLconnection);
var noSQLdb = new noSQLDatabase(NoSQLconnection);

var handlers = new RequestHandlers(SQLdb, noSQLdb);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({strict: false}));
app.use(helmet());

// Make sure all request return CORS headers
app.use(function (req, res, next) {
    var origin = req.get('origin');
    if (!origin || origin === 'undefined' || origin.length == 0) {
        origin = req.get('host');
    }
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-token-api');

    next();
});

Object.keys(config).forEach(function(key) {
  process.env[key] = config[key];
})

// Node App Port
var port = process.env.PORT || 3000;

// Initialize
routes(app, handlers, SQLdb, noSQLdb);

createServer(port);

/**
 * Creates the server.
 */
function createServer(config_port) {
	
    var port = config_port;
    app.listen(port);
 
    console.log("Server running on %s mode. Listening on port %d", app.settings.env, port);
}

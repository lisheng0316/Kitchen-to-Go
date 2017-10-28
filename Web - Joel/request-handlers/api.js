/**
 * This module is for the API.
 * @author: Joel R. Corporan.
 */

 // Module Import
var https = require("https");

exports.session = function(req, res, next) {
	var options = {
        "method": "POST",
        "hostname": "api.kitchen2go.net",
        "path": "/session",
        "headers": {
            "content-type": 'application/json',
            "email": "",
            "password": ""
        }
    };
}

exports.create_user = function(req, res, next) {
	var options = {
        "method": "POST",
        "hostname": "api.kitchen2go.net",
        "path": "/users",
        "headers": {
            "content-type": 'application/json',
            "x-token-api": ""
        }
    };
}

exports.get_user = function(req, res, next) {
	var options = {
        "method": "POST",
        "hostname": "api.kitchen2go.net",
        "path": "/users",
        "headers": {
            "content-type": 'application/json',
            "": "",
            "password": ""
        }
    };
}


exports.create_food = function(req, res, next) {
	var options = {
        "method": "POST",
        "hostname": "api.kitchen2go.net",
        "path": "/users",
        "headers": {
            "content-type": 'application/json',
            "x-token-api": ""
        }
    };
}

exports.get_foods = function(req, res, next) {
	var options = {
        "method": "GET",
        "hostname": "api.kitchen2go.net",
        "path": "/foods",
        "headers": {
            "content-type": 'application/json',
            "x-token-api": ""
        }
    };
}

function onRequest(options, body, callback_onRequest) {

    var request = http.request(options, function (response, error) {
        var chunks = [];

        response.on("error", function(error) {
            if (error) {
                error.status = 500;
                error.message = 'Error validating';
                callback_onRequest(error, null);
            }
        });

        response.on("data", function(chunk) {
            chunks.push(chunk);
        });

        response.on('end', function() {
            var body = Buffer.concat(chunks); 
            if(response.statusCode == 200) {
                var info = JSON.parse(body);
                callback_onRequest(null, info);
            }

            else if (response.statusCode == 204) {
                callback_onRequest(null, body);
            }

            else if (response.statusCode == 400) {
                var err = {status:response.statusCode, message: response.statusMessage}
                callback_onRequest(err, null);
            }

            else {
                var err = {status:response.statusCode, message: response.statusMessage}
        		callback_onRequest(err, null);
            }
        });  
    });

    request.end(JSON.stringify(body));
}
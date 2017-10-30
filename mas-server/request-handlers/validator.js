/**
 * This module is in charge validating incoming request.
 * @author: Joel R. Corporan
 */

// Import
var jsen = require("jsen");
var Validator = require("validator");

var schama_format = {
	formats: { 
		uuid: "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$", 
		url: "^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png)$",
		phone: "^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$",
		password: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\-+_!@#$%^&*,])(?!.*[\\s+])(.{8,15})$"
	}
}


const food_schema = { 
    type: "object", 
    properties: {
        "name": {
            "type": "string",
            "minLength": 2,
            "maxLength": 1024,
            "invalidMessage": "Invalid name: More that 2 character required",
            "requiredMessage": "name is required"
        },
        "description": {
            "type": "string",
            "minLength": 2,
            "maxLength": 1024,
            "invalidMessage": "Invalid description: More that 2 character required",
            "requiredMessage": "description is required"
        },
        "foodType": {
            "type": "string",
            "minLength": 2,
            "maxLength": 64,
            "invalidMessage": "Invalid foodType: character must be between 2 and 64",
            "requiredMessage": "foodType is required"
        },
        "ingredients": {
            "type": "array",
            "minItems": 1,
            "items": { 
            	"type": "string", 
            	"minLength": 2, 
            	"maxLength": 100, 
            	"invalidMessage": "Invalid ingredients object: character must be between 2 and 100" 
            },
            "invalidMessage": "Invalid ingredients: ingredient object required",
            "requiredMessage": "ingredients is required"
        },
        "quantity": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "invalidMessage": "Invalid quantity: quantity must be between 1 and 100",
            "requiredMessage": "quantity is required"
        },
        "price": {
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "invalidMessage": "Invalid quantity: price must be between 0 and 100",
            "requiredMessage": "price is required"
        },
        "image": {
            "type": "string",
            "format": "url",
            "invalidMessage": "Invalid image: Valid image URL required",
            "requiredMessage": "Image is required"
        },
        "expiration_date": {
            "type": "string",
            "minLength": 5,
            "invalidMessage": "Invalid Date: Date must be a string",
            "requiredMessage": "expiration_date is required"
        }
    },
    required: ["name", "description", "ingredients", "quantity", "price", "image", "expiration_date"]
}

var user_schema = {
	type: "object", 
	additionalProperties: false,
    properties: {
        "email": {
            "type": "string",
            "format": "email",
            "invalidMessage": "Invalid email",
            "requiredMessage": "email is required"
        },
        "firstName": {
            "type": "string",
            "minLength": 2,
            "maxLength": 64,
            "invalidMessage": "Invalid name: Must be between 2 and 64 character",
            "requiredMessage": "firstName is required"
        },
        "lastName": {
            "type": "string",
            "minLength": 2,
            "maxLength": 64,
            "invalidMessage": "Invalid lastName: Must be between 2 and 64 character",
            "requiredMessage": "lastName is required"
        },
        "password": {
            "type": "string",
            "format": "password",
            "invalidMessage": "Invalid Password: Must be between 8 and 15 characters and contain at least one number, one upper case letter, one lower case letter and one special character: -+_!@#$%^&*,",
            "requiredMessage": "password is required"
        },
        "phone": {
            "type": "string",
            "format": "phone",
            "invalidMessage": "Invalid email",
            "requiredMessage": "phone is required"
        }
    },
    required: ["firstName", "lastName", "email", "password", "phone"]
}

var cooker_schema = {
	additionalProperties: false,
	type: "object", 
    properties: {
        "address1": {
            "type": "string",
            "invalidMessage": "Invalid address1: Must be between 2 and 64 character",
            "requiredMessage": "address1 is required"
        },
        "address2": {
            "type": "string",
            "minLength": 0,
            "maxLength": 64,
            "invalidMessage": "Invalid address2: Must be between 0 and 64 character",
            "requiredMessage": "address2 is required"
        },
        "city": {
            "type": "string",
            "requiredMessage": "city is required"
        },
        "province": {
            "type": "string",
            "requiredMessage": "province is required"
        },
        "postalCode": {
            "type": "string",
            "requiredMessage": "postalCode is required"
        },
        "country": {
            "type": "string",
            "requiredMessage": "country is required"
        }
    },
    required: ["address1", "address2", "city", "province", "postalCode", "country"]
}



/**
 * Food Schema verification.
 * @param req: Request from the device.
 * @param res: Route to response the device.
 * @param next: Route to anothe method.
 */
exports.food = function(req, res, next) {
    const request = req.body;

	try {
		var validateSchema = jsen(food_schema, schama_format);
		var isValid = validateSchema(request);

		if (!isValid) {
			res.status(401).send(validateSchema.errors[0].message);
		} else {
			next();
		}

	} catch(e) {
		res.status(500).send("Error validating JSON");
	}

}

/**
 * User Schema verification.
 * @param req: Request from the device.
 * @param res: Route to response the device.
 * @param next: Route to anothe method.
 */
exports.cooker = function(req, res, next) {
    const request = req.body;

	try {
		var validateSchema = jsen(cooker_schema, schama_format);
		var isValid = validateSchema(request);

		if (!isValid) {
			res.status(401).send((validateSchema.errors[0].message !== undefined ? validateSchema.errors[0].message : "Invalid format"));
		} else {
			next();
		}

	} catch(e) {
		res.status(500).send("Error validating JSON");
	}

}

/**
 * User Schema verification.
 * @param req: Request from the device.
 * @param res: Route to response the device.
 * @param next: Route to anothe method.
 */
exports.user = function(req, res, next) {
    const request = req.body;

	try {
		var validateSchema = jsen(user_schema, schama_format);
		var isValid = validateSchema(request);

		if (!isValid) {
			res.status(401).send((validateSchema.errors[0].message !== undefined ? validateSchema.errors[0].message : "Invalid format"));
		} else {
			next();
		}

	} catch(e) {
		res.status(500).send("Error validating JSON");
	}

}

/**
 * Verify id format
 * @param req: Request from the device.
 * @param res: Route to response the device.
 * @param next: Route to anothe method.
 */
exports.id = function(req, res, next) {
    const id = req.params.id;

    try {
        if(Validator.isUUID(id, 4)) {
            next();
        } else {
            res.status(401).send("Invalid id Format");
        }

    } catch(e) {
        res.status(500).send("Error validating id");
    }
}

/**
 * Verify get food header
 * @param req: Request from the device.
 * @param res: Route to response the device.
 * @param next: Route to anothe method.
 */
exports.getFoods = function(req, res, next) {
    const longitude = parseFloat(req.query.longitude);
    const latitude = parseFloat(req.query.latitude);
    const miles = parseFloat(req.query.miles);

    try {
        if(longitude === undefined || longitude === "" || latitude === undefined || latitude === "" || miles === undefined || miles === "") {
            res.status(401).send("Invalid query(ies) format");
        } else {
            req.params.coordinate = {
                longitude: longitude,
                latitude: latitude,
                miles: miles
            }
            next();
        }
    } catch(e) {
        res.status(500).send("Error validating queries");
    }
}

/**
 * Verify User is on system
 * @param db: SQL instance.
 * @param req: Request from the device.
 * @param res: Route to response the device.
 * @param next: Route to anothe method.
 */
exports.session = function(db) {
	return function(req, res, next) {
        const query = "SELECT user_id, password FROM users WHERE email = $1"
		const values = [req.headers.email];

		db.query(query, values, function(err, result) {
			if(!err) {
				if(!result.rowCount <= 0) {
					req.params.user = {};
					req.params.user.user_id = result.rows[0].user_id;
					req.params.user.password = result.rows[0].password;
					next();
				}
				else {
					res.status(404).send("user/password not found");
				}
			} else {
				res.status(503).send('Service Disable');
			}
		});
    }
}


/**
 * This module is in charge validating incoming request.
 * @author: Joel R. Corporan
 */

// Import
var jsen = require('jsen');
var Validator = require('validator');


var schama_format = {
	formats: { 
		uuid: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$', 
		url: '^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png)$',
		phone: '^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$',
		password: '^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\-+_!@#$%^&*,])(?!.*[\s+])(.{8,15})$'
	}
}


const food_schema = { 
    type: 'object', 
    properties: {
        'name': {
            'type': 'string',
            'minLength': 2,
            'maxLength': 1024,
            'invalidMessage': 'Invalid name: More that 2 character required',
            'requiredMessage': 'name is required'
        },
        'description': {
            'type': 'string',
            'minLength': 2,
            'maxLength': 1024,
            'invalidMessage': 'Invalid description: More that 2 character required',
            'requiredMessage': 'description is required'
        },
        'ingredients': {
            'type': 'array',
            'minItems': 1,
            "items": { 
            	"type": "string", 
            	"minLength": 2, 
            	"maxLength": 100, 
            	'invalidMessage': 'Invalid ingredients object: character must be between 2 and 100' 
            },
            'invalidMessage': 'Invalid ingredients: ingredient object required',
            'requiredMessage': 'ingredients is required'
        },
        'quantity': {
            'type': 'integer',
            "minimum": 1,
            "maximum": 100,
            'invalidMessage': 'Invalid quantity: quantity must be between 1 and 100',
            'requiredMessage': 'quantity is required'
        },
        'price': {
            'type': 'number',
            "minimum": 0,
            "maximum": 100,
            'invalidMessage': 'Invalid quantity: price must be between 0 and 100',
            'requiredMessage': 'price is required'
        },
        'image': {
            'type': 'string',
            'format': 'url',
            'invalidMessage': 'Invalid image: Valid image URL required',
            'requiredMessage': 'Image is required'
        },
        'expiration_date': {
            'type': 'string',
            'minLength': 5,
            'invalidMessage': 'Invalid Date: Date must be a string',
            'requiredMessage': 'expiration_date is required'
        }
    },
    required: ['name', 'description', 'ingredients', 'quantity', 'price', 'image', 'expiration_date']
}

var user_schema = {
	type: 'object', 
    properties: {
        'fistName': {
            'type': 'string',
            'minLength': 2,
            'maxLength': 64,
            'invalidMessage': 'Invalid name: Must be between 2 and 64 character',
            'requiredMessage': 'First name is required'
        },
        'lastName': {
            'type': 'string',
            'minLength': 2,
            'maxLength': 64,
            'invalidMessage': 'Invalid lastName: Must be between 2 and 64 character',
            'requiredMessage': 'Last Name is required'
        },
        'email': {
            'type': 'string',
            'format': 'email'
            'invalidMessage': 'Invalid email',
            'requiredMessage': 'Email is required'
        },
        'password': {
            'type': 'string',
            'format': 'password'
            'invalidMessage': 'Invalid Password: Must be between 8 and 15 characters and contain at least one number, one upper case letter, one lower case letter and one special character: -+_!@#$%^&*,',
            'requiredMessage': 'Phone is required'
        },
        'phone': {
            'type': 'string',
            'format': 'email'
            'invalidMessage': 'Invalid email',
            'requiredMessage': 'Phone is required'
        }
    },
    required: ['fistName', 'lastName', 'email', 'phone']
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
		res.status(500).send('Error validating JSON');
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
			res.status(401).send(validateSchema.errors[0].message);
		} else {
			next();
		}

	} catch(e) {
		res.status(500).send('Error validating JSON');
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
                res.status(401).send('Invalid id Format');
            }

        } catch(e) {
            res.status(500).send('Error validating id');
        }
    }
}

/**
 * Verify User is on system
 * @param db: SQL instance.
 * @param req: Request from the device.
 * @param res: Route to response the device.
 * @param next: Route to anothe method.
 */
exports.db = function(db) {
	return function(req, res, next) {
        const query = "SELECT userId, password FROM users WHERE userName = $1"
		const values = [req.header.username];

		db.query(query, values, function(err, result) {
			if(!err) {
				if(!result.rowCount <= 0) {
					req.user.userId = result.rows[0].userId;
					req.user.password = result.rows[0].password;
					next();
				}
				else {
					res.status(404).send('user/password not found');
				}
			}
		});
    }
}


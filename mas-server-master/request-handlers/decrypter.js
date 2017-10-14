/**
 * This module decrypt data for communication purposes.
 * @author: Joel R. Corporan.
 */
var CryptoJS = require("crypto-js");

exports.emailDecrypt = function(req, res, next) {
	try {
		const find = ' ';
		const re = new RegExp(find, 'g');

		if(Object.keys(req.query).length === 0) {
			res.status(500).render('500');
		}
		else {
			var data_key = req.query.hengeshots.replace(re, '+');
		}

		var dataDecrypted = CryptoJS.AES.decrypt(data_key, process.env.ENCRYPT).toString(CryptoJS.enc.Utf8);

		var dataDecryptedObject = JSON.parse(dataDecrypted);
		req.params.dataDecrypted = dataDecryptedObject;
		next();
	}
	catch(error) {
		res.status(500).render('500');
	}
}


exports.encrypt = function(req, res, next) {
	try {
		var data = req.params.toEncrypt;
		var encryptedString = CryptoJS.AES.encrypt(JSON.stringify(data), req.params.cookie).toString();
		req.params.encrypted = encryptedString;

		next();
	}
	catch(error) {
		res.status(500).send('Internal Error');
	}
}
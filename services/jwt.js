'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_proyecto_portfolio_Alejandro_estarlich';

exports.createToken = function(user){
	var payload = {
		sub: user._id,
		username: user.username,
		email: user.email,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix
	};

	return jwt.encode(payload, secret);
};
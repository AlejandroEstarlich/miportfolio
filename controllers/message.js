'use strict'

var configMensaje = require ('../services/configMessage.js');
var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Contacto = require('../models/article.js')

var controller = {

	send: (req, res) => {
		configMensaje(req.body);
		res.status(200).send();
	}
}

module.exports = controller;
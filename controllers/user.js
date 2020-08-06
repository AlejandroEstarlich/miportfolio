'use strict'

var bcrypt = require('bcrypt-nodejs')
var User = require('../models/user');
var jwt = require('../services/jwt');


var controller = { 
	// Registro de Usuario
	saveUser: (req, res) => {
		var params = req.body;
		var user = new User();

		if(params.username && params.email && params.password){
			user.username = params.username;
			user.email = params.email;

			// Controlar usuarios duplicados
			User.find({ $or: [
				{email: user.email.toLowerCase()},
				{username: user.username.toLowerCase()}
			]}).exec((err, users) => {
				if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

				if(users && users.length >= 1){
					return res.status(200).send({message: 'El usuario que intentas registrar ya existe'})
				} else {
					// Cifra y guarda los datos
					bcrypt.hash(params.password, null, null, (err, hash) => {
						user.password = hash;

						user.save((err, userStored) => {
							if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

							if(userStored){
								res.status(200).send({user: userStored});
							} else {
								res.status(404).send({message: 'No se ha registrado el usuario'});
							}
						});
					});
				}
			});
		} else {
			res.status(200).send({
				message: 'Envía todos los campos necesarios'
			});
		}
	},

	// Login
	loginUser: (req, res) => {
		var params = req.body;

		var email = params.email;
		var password = params.password;

		User.findOne({email: email}, (err, user) => {
			if(err) return res.status(500).send({message: 'Error en la petición'});

			if(user){
				bcrypt.compare(password, user.password, (err, check) => {
					if(check){
						// Devolver datos de usuario
						if (params.gettoken) {
							// Devolver token
							// Generar token
							return res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							// Devolver usuario
							user.password = undefined;
							return res.status(200).send({user});
						}
					} else {
						res.status(404).send({message: 'El usuario no se ha podido identificar'});
					}
				});
			} else {
				res.status(404).send({message: '¡El usuario no se ha podido identificar!'});
			}
		});
	},

	// Conseguir datos de un usuario
	getUser: (req, res) => {
		var userId = req.params.id;

		User.findById(userId, (err, user) => {
			if(err) return res.status(500).send({message: 'Error en la petición'});

			if(!user) return res.status(404).send({message: 'El usuario no existe'});

			return res.status(200).send({user});
		});
	}
}

module.exports = controller;
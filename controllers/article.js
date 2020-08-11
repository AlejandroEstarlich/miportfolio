'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article.js')

var controller = {

	datosCurso: (req, res) => {
		return res.status(200).send({
			plataforma: 'Alejandro Estarlich Portfolio',
			autor: 'Alejandro Estarlich'
		});
	},

	test: (req,res) => {
		return res.status(200).send({
			message: 'Soy la acción test de mi controlador de articulos'
		});
	},

	save: (req, res) => {
		// Recoger los parámetros por post
		var params = req.body;

		// Validar datos (validator)
		try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
			var validate_slug = !validator.isEmpty(params.slug);
			var validate_tech = !validator.isEmpty(params.tech);
		}catch(err){
			return res.status(200).send({
				status: 'error',
				message: 'Faltan datos por enviar.'
			});
		}

		if(validate_title && validate_content){

			// Crear el objeto a Guardar
			var article = new Article();

			// Asignar valores
			article.title = params.title;
			article.content = params.content;
			article.slug = params.slug;
			article.tech = params.tech;

			if(params.image){
				article.image = params.image;
			} else {
				article.image = null;
			}

			// Guardar el artículo
			article.save((err, articleStored) => {
				if(err || !articleStored){
					return res.status(404).send({
						status: 'error',
						message: 'El artículo no se ha guardado'	
					});
				}

			// Devolver una respuesta
				return res.status(200).send({
					status: 'success',
					article: articleStored
				});
			});
		} else {
			return res.status(200).send({
				status: 'error',
				message: 'Los datos no son válidos'
			});
		}
	},

	getArticles: (req, res) => {

		var query = Article.find({});
		var last = req.params.last;

		if(last || last != undefined){
			query.limit(6);
		}

		// Find
		query.sort('-_id').exec((err, articles) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al devolver los artículos'
				});
			}

			if(!articles){
				return res.status(404).send({
					status: 'error',
					message: 'No hay artículos para mostrar'
				});
			}

			return res.status(200).send({
				status: 'success',
				articles
			});
		});
	},

	getArticle: (req, res) => {

		// Recoger id de la url
		var articleId = req.params.id;

		// Comprobar que existe
		if(!articleId || articleId == null){
			return res.status(404).send({
				status: 'error',
				message: 'No existe el artículo'
			});				
		}

		// Buscar el artículo
		Article.findById(articleId, (err, article) => {
			if(err || !article){
				return res.status(404).send({
					status: 'error',
					message: 'No existe el artículo'
				});				
			}
		
		// Devolverlo a json
			return res.status(200).send({
				status: 'success',
				article
			});				
		});
	},

	update: (req, res) => {

		// Recoger el id del artículo por URL
		var articleId = req.params.id;

		// Recogerlos datos que llegan por PUT
		var params = req.body;

		// Validar los datos
		try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
			var validate_tech = !validator.isEmpty(params.tech);
		}catch(err){
			return res.status(200).send({
				status: 'error',
				message: 'Faltan datos por enviar'
			});					
		}

		if (validate_title && validate_content) {
			// Find and update
			Article.findOneAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated) => {
				if(err){
					return res.status(500).send({
						status: 'error',
						message: 'Error al actualizar.'
					});				
				}
				if(!articleUpdated){
					return res.status(404).send({
						status: 'error',
						message: 'No existe el artículo.'
					});				
				}
				return res.status(200).send({
					status: 'success',
					article: articleUpdated
				});		
			});
		}else{
			// Devolver respuesta
			return res.status(200).send({
				status: 'error',
				message: 'La validación no es correcta.'
			});
		}
	},

	delete: (req, res) => {
		// Recoger el ID
		var articleId = req.params.id;

		// Find and Delete
		Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al borrar.'
				});				
			}

			if(!articleRemoved){
				return res.status(404).send({
					status: 'error',
					message: 'No se ha borrado el artículo, posiblemente no exista.'
				});				
			}

			return res.status(200).send({
				status: 'success',
				article: articleRemoved
			});
		});
	},

	upload: (req, res) => {
		// Configurar el módulo connect multiparty routes/article.js

		// Recoger el fichero de la petición
		var file_name = 'Imagen no subida';

		// console.log(req.files)
		// return res.status(404).send({
		// 	fichero: req.files
		// });

		if(!req.files){
			return res.status(404).send({
				status: 'error',
				message: file_name
			});
		}

		// Conseguir nombre y extensión de archivo
		var file_path = req.files.file0.path;
		var file_split = file_path.split('\\');

		// ADVERTENCIA: EN LINUS O MAC
		//var file_split = file_path.split('/');

		// Nombre del archivo
		var file_name = file_split[2];

		// Extensión del archivo
		var extension_split = file_name.split('\.');
		var file_ext = extension_split[1];

		// Comprobar la extensión, solo imagenes, si no es valida, borrar el fichero

		if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
			// Borrar el archivo
			fs.unlink(file_path, (err) => {
				return res.status(200).send({
					status: 'error',
					message: 'La extensión de archivo no es válida.'
				});
			});
		} else {
			// Si todo es válido, buscar el articulo, asignarle un nombre de la imagen y actualizarlo
			//Sacamos el id de la url
			var articleId = req.params.id;

			if(articleId){
				Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) => {
					if(err || !articleUpdated){
						return res.status(200).send({
							status: 'error',
							article: 'Error al guardar la imagen.'
						});					
					}

					return res.status(200).send({
						status: 'success',
						article: articleUpdated
					});
				});				
			} else {
				return res.status(200).send({
					status: 'success',
					image: file_name
				});				
			}
		}
	},

	getImage: (req, res) => {
		var file = req.params.image;
		var path_file = './upload/articles/'+file;

		fs.exists(path_file, (exists) => {
			console.log(exists);
			if (exists) {
				return res.sendFile(path.resolve(path_file));
			} else {
				return res.status(404).send({
					status: 'error',
					message: 'La imagen no existe.'
				});					
			}
		});		
	},

	search: (req, res) => {
		// Sacar el string a buscar
		var searchString = req.params.search;

		// Find or
		Article.find({ "$or": [
			{ "title" : { "$regex": searchString, "$options": "i"}},
			{ "content" : { "$regex": searchString, "$options": "i"}},
			{ "slug" : { "$regex": searchString, "$options": "i"}},
		]})
		.sort([['date', 'descending']])
		.exec((err, articles) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error en la petición.'
				});	
			}

			if(!articles || articles.length <= 0){
				return res.status(404).send({
					status: 'error',
					message: 'No hay artículos que coincidan con tu búsqueda.'
				});	
			}

			return res.status(200).send({
				status: 'success',
				articles
			});	
		});
	}
}

module.exports = controller;
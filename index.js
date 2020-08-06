'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

// Conexión Database
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { 
			useMongoClient: true,
			useNewUrlParser: true,
			useUnifiedTopology: true, 
    		useFindAndModify: false
			})
		.then(() => {
			console.log('La conexión a la base de datos se ha realizado con éxito');

			// Crear servidor y escuchar peticiones HTTP
			app.listen(port, () => {
				console.log('Servidor corriendo en http://localhost:'+port)
			});
		});
'use strict'

// Cargar módulos de node para servidor
var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const configMensaje = require('./configMensaje');
var path = require('path');

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas
var article_routes = require('./routes/article');
var user_routes = require('./routes/user');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.post('/formulario', (req, res) => {
	configMensaje(req.body);
	res.status(200).send();
})

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Añadir prefijos a rutas / Cargar rutas
app.use('/api/', article_routes);
app.use('/api/', user_routes);

// Exportar módulo (fichero actual)
module.exports = app;
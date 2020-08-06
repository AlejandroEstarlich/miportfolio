'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');


router.post('/register', UserController.saveUser);
router.post('/login', UserController.loginUser);
router.get('/user/:id', md_auth.ensureAuth, UserController.getUser);

module.exports = router;

// md_auth.ensureAuth,

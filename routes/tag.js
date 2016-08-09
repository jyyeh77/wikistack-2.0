'use strict'
var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');

router.get('/', function(req, res, next){
  res.render('tags');

})

module.exports = router;

// route to display home page with links to individual pages
'use strict';
var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;

router.get('/', function(req, res) {
	var myPages = Page.findAll({
		attributes: ['title', 'urlTitle']
	});
	myPages
		.then(function(content) {
			var myLinks = [];
			for(var i = 0; i < content.length; i ++) {
				myLinks.push({title: content[i].title, urlTitle: content[i].urlTitle});
			}
			res.render('index', {pages: myLinks});
		});
});



module.exports = router;

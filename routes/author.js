var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');

// for rendering single user page
router.get('/:userId', function(req, res, next) {

  var userPromise = User.findById(req.params.userId);
  var pagesPromise = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });
  Promise.all([
    userPromise,
    pagesPromise
  ])
  .then(function(values) {
    var user = values[0];
    var pages = values[1];
    res.render('singleUser', { userName: user.name, articles: pages });
  })
  .catch(next);
});

// renders page with all user names and IDs

router.get('/', function(req, res) {

  var myUsers = User.findAll({
		attributes: ['name', 'id']
	});
  myUsers
  	.then(function(contents){
  		var userLinks = [];
  		for (var i = 0; i < contents.length; i++){
  			userLinks.push({name: contents[i].name, id: contents[i].id})
  		}
  		res.render('user', {users: userLinks});
  	})

});

module.exports = router;

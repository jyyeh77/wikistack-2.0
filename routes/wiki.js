var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/add', function(req, res) {
  res.render('addpage');
});

router.get('/', function(req, res, next) {
	res.redirect('/');
});

// processes POST request from submit button in addpage, redirects to /wiki/someTitle route
router.post('/', function(req, res, next) {

  // finds existing user or creates new user in database based on inputted
  // name and email in req.body
	User.findOrCreate({
  	where: {
    	name: req.body.name,
    	email: req.body.email
  		}
	})
	.then(function(values) {

		var user = values[0];

		var postSubmission = req.body;
    var arr = [];
    var tagArray = req.body.tags.split(/\s+/);

    // inputs separated tags into array for display on created single-wiki page
    for (var tag in tagArray){
      arr.push(tagArray[tag]);
    }
    // creates new page with title and content submitted in addpage
		var page = Page.build({
			title: postSubmission.title,
			content: postSubmission.content,
      tags: arr
		});

    // sets user foreign key ID to created page
		return page.save()
			.then(function(content){
				return page.setAuthor(user);
		})
	})
	.then(function(page) {
		res.redirect('/wiki/' + page.urlTitle);
	})
});

// redirects to page containing tag(s)
router.get('/search?', function (req, res, next){
  console.log('Tags: ', req.query);
  Page.findAll({
    where: {
      tags: {$contains: req.query.tags.split(' ')}
    }
  })
    .then(function(page){
      res.redirect('/wiki/' + page[0].urlTitle);
    })
    .catch(function(err){
      res.send("Your tags don't exist! Please go back!");
    })
})


// allows user to search for all pages containing clicked tag on single-wiki page
router.get('/tagpage/:tagName', function(req, res, next){
  Page.findAll({
    where: {
      tags: {$contains : [req.params.tagName]}
    }
  }) .then(function(page){
      res.render('tagpages', {pages: page});
  }) .catch(next);

})
// goes to specific wiki page

router.get('/:urlTitle', function (req, res, next) {


  // finds page that matches url Title
	var myPage;
  	Page.findOne({
    	where: {
      	urlTitle: req.params.urlTitle
    	}
  	})
  	.then(function(foundPage){
  		if (foundPage === null){
  			res.status(404).send();
  		} else {
  			myPage = foundPage;
      // finds user that matches author ID assigned to page
			var findUser = User.findOne({
		  		where: {
		  			id: foundPage.authorId
		  		}
	  		});
  			return findUser;
  		}
  	})
    // passes user object and renders wikipage HTML using user info
  	.then(function(foundUser) {
  		var myUser = foundUser;
  		res.render('wikipage', {pageTitle: myPage.title, urlTitle: myPage.urlTitle, pageContent: myPage.content, authorName: myUser.name, authorUrl: '/users/' + myUser.id, tags: myPage.tags});
  	})
  	.catch(next);

});



module.exports = router;

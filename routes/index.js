var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET posts - mongoose function: find
router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts) {
		if (err) return next(err);
		res.json(posts);
	});
});

// POST posts - mongoose function: save
router.post('/posts', function(req, res, next) {
	var post = new Post(req.body);
	post.save(function(err, post) {
		if (err) return next(err);
		res.json(post);
	});
});

// run before route if route url contains :post
// Express function : param
router.param('post', function(req, res, next, id) {
	var query = Post.findById(id);
	query.exec(function(err, post) {
		if (err) return next(err);
		if (!post) return next(new Error('Post not found'));
		req.post = post;
		return next();
	});
});

router.get('/posts/:post', function(req, res) {
	res.json(req.post);
});

module.exports = router;

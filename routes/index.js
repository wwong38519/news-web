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

// GET post by post id and populate comments for the post
router.get('/posts/:post', function(req, res, next) {
	req.post.populate('comments', function(err, post) {
		if (err) return next(err);
		res.json(req.post);
	});
});

// PUT upvote - model.save in schema
router.put('/posts/:post/upvote', function(req, res, next) {
	req.post.upvote(function(err, post) {
		if (err) return next(err);
		res.json(post);
	});
});

// POST saves comment to post
router.post('/posts/:post/comments', function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;
	comment.save(function(err, comment) {
		if (err) return next(err);
		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			if (err) return next(err);
			res.json(comment);
		});
	});
});

router.param('comment', function(req, res, next, id) {
	var query = Comment.findById(id);
	query.exec(function(err, comment) {
		if (err) return next(err);
		if (!comment) return next(new Error('Comment not found'));
		req.comment = comment;
		return next();
	});
});

// PUT upvote - upvote a comment of a post
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		if (err) return next(err);
		res.json(comment);
	});
});

module.exports = router;

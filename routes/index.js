var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var router = express.Router();

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

var secret = process.env.SECRET || 'SECRET';

// userProperty: property on req to put payload from token, default = req.user
var auth = jwt({secret: secret, userProperty: 'payload'});

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
router.post('/posts', auth, function(req, res, next) {
	var post = new Post(req.body);
	post.author = req.payload.username;
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
router.put('/posts/:post/upvote', auth, function(req, res, next) {
	req.post.upvote(function(err, post) {
		if (err) return next(err);
		res.json(post);
	});
});

// POST saves comment to post
router.post('/posts/:post/comments', auth, function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;
	comment.author = req.payload.username;
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
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		if (err) return next(err);
		res.json(comment);
	});
});

router.post('/register', function(req, res, next) {
	if (!req.body.username) {
		return res.status(400).json({message: 'Please enter username'});
	}
	if (!req.body.password) {
		return res.status(400).json({message: 'Please enter password'});
	}
	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password);
	user.save(function(err) {
		if (err) return next(err);
		return res.json({token: user.generateJWT()});
	});
});

router.post('/login', function(req, res, next) {
	if (!req.body.username) {
		return res.status(400).json({message: 'Please enter username'});
	}
	if (!req.body.password) {
		return res.status(400).json({message: 'Please enter password'});
	}
	passport.authenticate('local', function(err, user, info) {
		if (err) return next(err);
		if (user) {
			return res.json({token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		}
	})(req, res, next);
});

module.exports = router;

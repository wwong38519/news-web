var app = angular.module('news-web-app', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('home', {
		url: '/home',
		templateUrl: '/home.html',
		controller: 'main-controller',
		resolve: {
			postPromise: ['posts', function(posts) {
				return posts.getAll();
			}]
		}
	})
	.state('posts', {
		url: '/posts/{id}',
		templateUrl: '/posts.html',
		controller: 'posts-controller',
		resolve: {
			/* if function, then it is injected and the return value is treated as the dependency. If the result is a promise, it is resolved before the controller is instantiated and its value is injected into the controller */
			/* promise is returned here so that 'post' is injected into controller and retrieving post does not go through service 'posts' */
			post: ['$stateParams', 'posts', function($stateParams, posts) {
				return posts.get($stateParams.id);
			}]
		}
	});
	$urlRouterProvider.otherwise('home');
}]);

app.factory('posts', ['$http', function($http) {
	var o = {
		posts : []
	};
	o.getAll = function() {
		return $http.get('/posts').success(function(data) {
			angular.copy(data, o.posts);
		});
	};
	o.create = function(post) {
		return $http.post('/posts', post).success(function(data) {
			o.posts.push(data);
		});
	};
	o.upvote = function(post) {
		return $http.put('/posts/'+post._id+'/upvote').success(function(data) {
			post.upvotes += 1;
		});
	};
	o.get = function(id) {	// return a promise
		return $http.get('/posts/'+id).then(function(res) {
			return res.data;
		});
	};
	o.addComment = function(id, comment) {
		return $http.post('/posts/'+id+'/comments', comment);
	};
	o.upvoteComment = function(post, comment) {
		return $http.put('/posts/'+post._id+'/comments/'+comment._id+'/upvote').success(function(data) {
			comment.upvotes += 1;
		});
	};
	return o;
}]);

app.controller('main-controller', ['$scope', 'posts', function($scope, posts) {
	$scope.site_title = 'Hello World';
	$scope.posts = posts.posts;
	$scope.addPost = function() {
		if (!$scope.title || $scope.title === '') { return; }
		posts.create({
			title: $scope.title,
			link: $scope.link
		});
		$scope.title = '';
		$scope.link = '';
	};
	$scope.incrementUpvotes = function(post) {
		posts.upvote(post);
	};
}]);

app.controller('posts-controller', ['$scope', 'posts', 'post', function($scope, posts, post) {
	$scope.post = post;
	$scope.addComment = function() {
		if ($scope.body === '') { return; }
		posts.addComment(post._id, {
			body: $scope.body,
			author: 'user'
		}).success(function(comment) {
			$scope.post.comments.push(comment);
		});
		$scope.body = '';
	};
	$scope.incrementUpvotes = function(comment) {
		posts.upvoteComment(post, comment);
	};
}]);


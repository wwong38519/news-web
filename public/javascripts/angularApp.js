var app = angular.module('news-web-app', ['ui.router']);

var site_title = 'Hello World!';

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
	.state('register', {
		url: '/register',
		templateUrl: '/register.html',
		controller: 'auth-controller',
		onEnter: ['$state', 'auth', function($state, auth) {
			if (auth.isLoggedIn()) {
				$state.go('home');
			}
		}]
	})
	.state('login', {
		url: '/login',
		templateUrl: '/login.html',
		controller: 'auth-controller',
		onEnter: ['$state', 'auth', function($state, auth) {
			if (auth.isLoggedIn()) {
				$state.go('home');
			}
		}]
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

app.factory('auth', ['$http', '$window', function($http, $window) {
	var auth = {};
	auth.saveToken = function(token) {
		$window.localStorage['news-web-token'] = token;
	};
	auth.getToken = function() {
		return $window.localStorage['news-web-token'];
	};
	auth.isLoggedIn = function() {
		var token = auth.getToken();
		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.expire > Date.now() / 1000;
		} else {
			return false;
		}
	};
	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	};
	auth.register = function(user) {
		return $http.post('/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};
	auth.login = function(user) {
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};
	auth.logout = function() {
		$window.localStorage.removeItem('news-web-token');
	};
	return auth;
}]);

app.factory('posts', ['$http', 'auth', function($http, auth) {
	var o = {
		posts : []
	};
	o.header = function() {
		return {
			headers: {
				Authorization: 'Bearer ' + auth.getToken()
			}
		};
	};
	o.getAll = function() {
		return $http.get('/posts').success(function(data) {
			angular.copy(data, o.posts);
		});
	};
	o.create = function(post) {
		return $http.post('/posts', post, o.header()).success(function(data) {
			o.posts.push(data);
		});
	};
	o.upvote = function(post) {
		return $http.put('/posts/'+post._id+'/upvote', null, o.header()).success(function(data) {
			post.upvotes += 1;
		});
	};
	o.get = function(id) {	// return a promise
		return $http.get('/posts/'+id).then(function(res) {
			return res.data;
		});
	};
	o.addComment = function(id, comment) {
		return $http.post('/posts/'+id+'/comments', comment, o.header());
	};
	o.upvoteComment = function(post, comment) {
		return $http.put('/posts/'+post._id+'/comments/'+comment._id+'/upvote', null, o.header()).success(function(data) {
			comment.upvotes += 1;
		});
	};
	return o;
}]);

app.controller('nav-controller', ['$scope', 'auth', function($scope, auth) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logout = auth.logout;
}]);

app.controller('auth-controller', ['$scope', '$state', 'auth', function($scope, $state, auth) {
	$scope.site_title = site_title;
	$scope.user = {};
	$scope.register = function() {
		auth.register($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
		});
	};
	$scope.login = function() {
		auth.login($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
		});
	};
}]);

app.controller('main-controller', ['$scope', 'auth', 'posts', function($scope, auth, posts) {
	$scope.site_title = site_title;
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
	$scope.isLoggedIn = auth.isLoggedIn;
}]);

app.controller('posts-controller', ['$scope', 'posts', 'post', 'auth', function($scope, posts, post, auth) {
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
	$scope.isLoggedIn = auth.isLoggedIn;
}]);


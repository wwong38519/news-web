var app = angular.module('news-web-app', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('home', {
		url: '/home',
		templateUrl: '/home.html',
		controller: 'main-controller'
	})
	.state('posts', {
		url: '/posts/{id}',
		templateUrl: '/posts.html',
		controller: 'posts-controller'
	});
	$urlRouterProvider.otherwise('home');
}]);

app.factory('posts', [function() {
	var o = {
		posts: [
			{title: 'Post 1', upvotes: 5},
			{title: 'Post 2', upvotes: 57},
			{title: 'Post 3', upvotes: 125},
			{title: 'Post 4', upvotes: 84},
			{title: 'Post 5', upvotes: 29}
		]
	}
	return o;
}]);

app.controller('main-controller', ['$scope', 'posts', function($scope, posts) {
	$scope.site_title = 'Hello World';
	$scope.posts = posts.posts;
	$scope.addPost = function() {
		if (!$scope.title || $scope.title === '') { return; }
		$scope.posts.push({
			title: $scope.title,
			link: $scope.link,
			upvotes: 0,
			comments: [
				{author: 'Joe', body: 'Cool post!', upvotes: 0},
				{author: 'Bob', body: 'Great idea!', upvotes: 0},
			]
		});
		$scope.title = '';
		$scope.link = '';
	};
	$scope.incrementUpvotes = function(post) {
		post.upvotes += 1;
	};
}]);

app.controller('posts-controller', ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts) {
	$scope.post = posts.posts[$stateParams.id];
	$scope.addComment = function() {
		if ($scope.body === '') { return; }
		$scope.post.comments.push({
			body: $scope.body,
			author: 'user',
			upvotes: 0
		});
		$scope.body = '';
	};
}]);


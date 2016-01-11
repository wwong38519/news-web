var app = angular.module('news-web-app', []);

app.controller('main-controller', ['$scope', function($scope) {
	$scope.test = 'Hello World';
	$scope.posts_title = ['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5'];
	$scope.posts = [
		{title: 'Post 1', upvotes: 5},
		{title: 'Post 2', upvotes: 57},
		{title: 'Post 3', upvotes: 125},
		{title: 'Post 4', upvotes: 84},
		{title: 'Post 5', upvotes: 29}
	];
	$scope.addPost = function() {
		$scope.posts.push({title: 'A new post', upvoes: 0});
	};
}]);


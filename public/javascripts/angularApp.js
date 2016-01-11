var app = angular.module('news-web-app', []);

app.controller('main-controller', ['$scope', function($scope) {
	$scope.test = 'Hello World';
	$scope.posts = [
		{title: 'Post 1', upvotes: 5},
		{title: 'Post 2', upvotes: 57},
		{title: 'Post 3', upvotes: 125},
		{title: 'Post 4', upvotes: 84},
		{title: 'Post 5', upvotes: 29}
	];
	$scope.addPost = function() {
		if (!$scope.title || $scope.title === '') { return; }
		$scope.posts.push({
			title: $scope.title,
			link: $scope.link,
			upvotes: 0
		});
		$scope.title = '';
		$scope.link = '';
	};
	$scope.incrementUpvotes = function(post) {
		post.upvotes += 1;
	};
}]);


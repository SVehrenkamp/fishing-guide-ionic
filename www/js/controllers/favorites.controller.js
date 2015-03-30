app.controller('FavoritesController', function($scope, $rootScope, $http, $BASEURL){
	$scope.favorites = {};
	$scope.user = $rootScope.user;
	$scope.getAllFavorites = function(id){
		$http.get($BASEURL+'/api/favorites?filter[where][userId]='+id).success(function(data){
			$scope.favorites = data;
		});
	}

	//Make API Call to get all favorites
	$scope.getAllFavorites($scope.user.id);


});
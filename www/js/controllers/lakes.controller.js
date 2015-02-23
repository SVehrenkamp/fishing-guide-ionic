app.controller('LakesController', function($scope, $lakes, coordinates){
	$scope.coords = {
		lat : coordinates.latitude,
		lng : coordinates.longitude,
	};
	$scope.coords.str = $scope.coords.lat+","+$scope.coords.lng;

	$scope.showCoords = function(){
		console.log($scope.coords);
	}

	$scope.showNearByLakes = function(params){
		$lakes.getNearByLakes(params).then(function(resp){
			resp = resp.data.nearBy;
			$scope.nearByLakes = resp;
			console.log(resp);
		});
	}

	$scope.showNearByLakes($scope.coords.str);
	$scope.showCoords();

});
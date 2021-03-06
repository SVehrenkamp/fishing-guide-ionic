app.controller('TripController', function($scope, $rootScope, $trips, $location, $http, ipCookie, coordinates, User, $BASEURL, $lakes, uiGmapGoogleMapApi){

	//console.log('MainController Initialized::', $cookies);
	//GET Location
	$rootScope.tripStarted = false;
    $scope.coords = coordinates;
    $scope.coordinates = {
		lat : coordinates.latitude,
		lng : coordinates.longitude,
	};
	
	//Get User info from lb-services
	// $scope.getUser = function(){
	// 	$scope.user = User.getCurrent(
	// 		function(data){
	// 			//success
	// 			console.log('Success!');
	// 		},
	// 		function(res){
	// 			//error
	// 			console.log('ERROR::', res);
	// 			//redirect to login page
	// 			$location.url('/user/login');
	// 		});
	// };
	$scope.closestLake = {};

	$scope.coordinates.str = $scope.coordinates.lat+","+$scope.coordinates.lng;
	$scope.getClosestLake = function(params){
		$lakes.getNearByLakes(params).then(function(resp){
			resp = resp.data.nearBy;
			$scope.closestLake = resp[0];
			$rootScope.lake = $scope.closestLake.id;
			console.log(resp);
		});
	}

	$scope.drawMap = function(){
		$scope.map = {
			center: {
				latitude: $scope.coords.latitude, 
				longitude: $scope.coords.longitude 
			},
			options: {
				mapTypeId: 'hybrid'
			},
			zoom: 16 
		};
	}
	//Set Map Marker
	$scope.setMarker = function(){

		//Map Center
		$scope.marker = {
	      id: 0,
	      coords: $scope.coords,
	      //Add Map Options
	      options: { draggable: true },
	      //Handle Map Events
	      events: {
	        dragend: function (marker, eventName, args) {
	          $log.log('marker dragend');
	          var lat = marker.getPosition().lat();
	          var lon = marker.getPosition().lng();
	          $log.log(lat);
	          $log.log(lon);

	          $scope.marker.options = {
	            draggable: true,
	            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
	            labelAnchor: "100 0",
	            labelClass: "marker-labels"
	          };
	        }
	      }
	    };
	}
	// //Get Initial Weather Snapshot Data		
	// $scope.getWeather = function(){	
	// 	$forecast.getWeather().then(function(response){
	// 		console.log('CONTROLLER::', response.data);
	// 		$scope.data = response;
			
	// 		$scope.initialTripData = response.data;
	// 		$scope.initialTripData.user_id = "svehrenkamp";
	// 		$scope.initialSnapshot = response.snapshot;
	// 	});
	// }	
	// $trips.getTrips().then(function(resp){
	// 	$scope.trips = resp.data;
	// });

	//Start A Trip session, take initial snapshot, persist to mongo and redirect to trip session page
	$scope.createTrip = function(data){
		data = {};
		data.user_id = $rootScope.user.id;
		data.lake = $rootScope.lake;
		$http.post($BASEURL+'/createtrip/'+$scope.coords.latitude+','+$scope.coords.longitude, data).success(function(resp){
			console.log(resp);
			$location.url('/app/trips/'+resp.snapshot.tripId);
		});
		$rootScope.tripStarted = true;
		
	}

	//Get User
	//$scope.getUser();
	//Draw Map
	$scope.drawMap();
	//Set Marker
	$scope.setMarker();
	//Get Initial Weather Snapshot Data		
	//$scope.getWeather();
	$scope.getClosestLake($scope.coordinates.str);

});
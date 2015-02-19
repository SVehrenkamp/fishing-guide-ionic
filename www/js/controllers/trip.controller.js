app.controller('TripController', function($scope, $rootScope, $trips, $forecast, $location, ipCookie, coordinates, User){

	//console.log('MainController Initialized::', $cookies);
	//GET Location
	$rootScope.tripStarted = false;
    $scope.coords = coordinates;
	
	//Get User info from lb-services
	$scope.getUser = function(){
		$scope.user = User.getCurrent(
			function(data){
				//success
				console.log('Success!');
			},
			function(res){
				//error
				console.log('ERROR::', res);
				//redirect to login page
				$location.url('/user/login');
			});
	};


	$scope.drawMap = function(){
		$scope.map = {
			center: {
				latitude: $scope.coords.latitude, 
				longitude: $scope.coords.longitude 
			},
			options: {
				mapTypeId: 'satellite'
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
	//Get Initial Weather Snapshot Data		
	$scope.getWeather = function(){	
		$forecast.getWeather().then(function(response){
			console.log('CONTROLLER::', response.data);
			$scope.data = response;
			
			$scope.initialTripData = response.data;
			$scope.initialTripData.user_id = $scope.user.id;
			$scope.initialSnapshot = response.snapshot;
		});
	}	
	// $trips.getTrips().then(function(resp){
	// 	$scope.trips = resp.data;
	// });

	//Start A Trip session, take initial snapshot, persist to mongo and redirect to trip session page
	$scope.createTrip = function(){
		$trips.createTrip(JSON.stringify($scope.initialTripData)).success(function(data){
			
			$scope.initialSnapshot.tripId = data.id;
			$scope.initialSnapshot.timestamp = Date.now();
			console.log($scope.initialSnapshot);
			
			$trips.createSnapshot(JSON.stringify($scope.initialSnapshot)).success(function(data){
				$location.url('/'+$scope.initialSnapshot.tripId);
			});	
		});
		$rootScope.tripStarted = true;
		
	};

	//Get User
	$scope.getUser();
	//Draw Map
	$scope.drawMap();
	//Set Marker
	$scope.setMarker();
	//Get Initial Weather Snapshot Data		
	$scope.getWeather();
			

});
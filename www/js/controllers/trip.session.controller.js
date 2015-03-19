app.controller('TripSessionController', function($scope, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $stateParams, $trips, $http, $interval, $location, coordinates, $BASEURL, $timeout){
	$scope.id = $stateParams.tripId;
	$scope.collapsed = [];
	$scope.active = true;
	$scope.$on('$locationChangeStart', function(event) {
		$rootScope.tripStarted = false;
	});

	var setNewLocation = function(location){

      //coords.latitude = location.coords.latitude;
      //coords.longitude = location.coords.longitude;
      //Set Coords as cookies
      //ipCookie('lat', this.coords.latitude);
      //ipCookie('long', this.coords.longitude);

      app.constant('coordinates', location.coords);
      console.log('Location::', location.coords);

    }

    //Call the browser's geolocation method to get coords
    var updateLocation = function(cb){
      navigator.geolocation.getCurrentPosition(setNewLocation);
      console.log('Getting Location..');
      return cb();
    }

	$scope.collapse = function($index){
		if($scope.collapsed[$index] === true){
			$scope.collapsed[$index] = false
		} else {
			$scope.collapsed[$index] = true;
		}
	}
	var formatTime = function(time, datestring){
		time = new Date(time);
		datestring = 
			(time.getMonth()+1) +'-'+ time.getDate()+'-'+time.getFullYear()+' at '+(time.getHours()+1)+':'+(time.getMinutes()+1);
		$scope.time = datestring;
	}

	$scope.getSnapshots = function(){
		$trips.getSnapshots($scope.id).then(function(data){
			$scope.snapshots = data.data;
			$scope.data = $scope.snapshots[0];
			formatTime($scope.data.timestamp);
			console.log($scope.snapshots)
		});
	}
	// $scope.addFish = function(modalData){
	// 	updateLocation(function(){
	// 		var lat = coordinates.latitude, 
	// 			lng = coordinates.longitude;

	// 		$http.get($BASEURL+'/weather/'+lat+','+lng).success(function(response){
	// 			$scope.snapshot = response.snapshot;
	// 			$scope.snapshot.tripId = $scope.id;
	// 			$scope.snapshot.timestamp = Date.now();
	// 			$scope.snapshot.fish = modalData;

	// 			$trips.createSnapshot(JSON.stringify($scope.snapshot)).then(function(data){
	// 				$scope.getSnapshots();
	// 			});
	// 			console.log(response);
	// 		});
	// 	});
	// 	// $forecast.getWeather().then(function(response){
	// 	// 	$scope.snapshot = response.snapshot;
	// 	// 	$scope.snapshot.tripId = $scope.id;
	// 	// 	$scope.snapshot.timestamp = Date.now();
	// 	// 	$scope.snapshot.fish = modalData;

	// 	// 	// $trips.createSnapshot(JSON.stringify($scope.snapshot)).then(function(data){
	// 	// 	// 	$scope.getSnapshots();
	// 	// 	// });

	// 	// });
	// };

	// $scope.openModal = function(){
	// 	var modalInstance = $modal.open({
	//       templateUrl: 'templates/modal.html',
	//       controller: 'ModalController',
	//       resolve: {
	//         addFish: function () {
	//           return $scope.addFish;
	//         }
	//       }
 // 	   });

	// }


$scope.species = [
		'sunfish',
		'crappie',
		'bass',
		'Pike',
		'catfish',
		'walleye',
		'sauger',
		'trout'

	];
	$scope.fish = {};
	$scope.selected = [];

	$scope.species_selected = false;


	$scope.select = function($index){
		$scope.selected[$index] = true;
		$scope.species_selected = true;
		
		$timeout(function(){
			$ionicSlideBoxDelegate.next();
		}, 0300);
	}
	//$scope.addFish = addFish;

	$ionicModal.fromTemplateUrl('templates/modal.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal = modal;
  	});
  
  $scope.addFish = function() {
    $scope.modal.show();
  };
  $scope.cancel = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

	$scope.endTrip = function(){
		$scope.active = false;
		$location.url('/');
	}

	if($scope.active){
		$interval(function(){
			$scope.addFish()
		}, 420000);
	} else { console.log('Trip ended..')}
	$scope.getSnapshots();

});
app.controller('TripSessionController', function($scope, $rootScope, $stateParams, $trips, $forecast, $interval, $modal, $location){
	$scope.id = $stateParams.tripId;
	$scope.collapsed = [];
	$scope.active = true;
	$scope.$on('$locationChangeStart', function(event) {
		$rootScope.tripStarted = false;
	});

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
			console.log($scope.data)
		});
	}
	$scope.addFish = function(modalData){

		$forecast.getWeather().then(function(response){
			$scope.snapshot = response.snapshot;
			$scope.snapshot.tripId = $scope.id;
			$scope.snapshot.timestamp = Date.now();
			$scope.snapshot.fish = modalData;

			$trips.createSnapshot(JSON.stringify($scope.snapshot)).then(function(data){
				$scope.getSnapshots();
			});

		});
	};

	$scope.openModal = function(){
		var modalInstance = $modal.open({
	      templateUrl: 'js/views/_modal.html',
	      controller: 'ModalController',
	      resolve: {
	        addFish: function () {
	          return $scope.addFish;
	        }
	      }
 	   });

	}

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
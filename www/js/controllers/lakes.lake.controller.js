app.controller('LakeViewController', function($scope, $lakes, $stateParams){
	$scope.id = $stateParams.lakeId;
	
	//Get Lake Data
	$scope.getLakeData = function(id){
		$lakes.getLake(id).then(function(data){
			$scope.lake = data.data;
			$scope.setCoords();
		});
	}
	$scope.getLakeData($scope.id);
	
	$scope.setCoords = function(){
		$scope.coords = {
			latitude : $scope.lake.geo.lat,
			longitude : $scope.lake.geo.lng
		}
		$scope.drawMap();
		$scope.setMarker();
	}

	//Draw Map
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
		console.log('Draw Map Called!');
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
	            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.long,
	            labelAnchor: "100 0",
	            labelClass: "marker-labels"
	          };
	        }
	      }
	    };

		console.log('Set Marker Called!', $scope.marker);
	}

});
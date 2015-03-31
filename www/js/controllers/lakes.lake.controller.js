app.controller('LakeViewController', function($scope, $lakes, $stateParams, uiGmapGoogleMapApi, coordinates, $http, $KEY){
	$scope.id = $stateParams.lakeId;
	$scope.userCoords = {
		latitude: coordinates.latitude,
		longitude: coordinates.longitude
	};
	

	//Draw Map
	$scope.drawMap = function(){
		$scope.map = {
			control: {},
			center: {
				latitude: $scope.coords.latitude, 
				longitude: $scope.coords.longitude 
			},
			options: {
				mapTypeId: 'hybrid'
			},
			zoom: 16 
		};
		console.log('Draw Map Called!');
	}
	//Set Map Marker
	$scope.setMarker = function(){
		//Map Center
		$scope.markers = [
		{
	      id: 0,
	      coords: $scope.userCoords,
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

	          $scope.markers[0].options = {
	            draggable: true,
	            labelContent: "lat: " + $scope.useCoords.latitude + ' ' + 'lon: ' + $scope.useCoords.longitude,
	            labelAnchor: "100 0",
	            labelClass: "marker-labels"
	          };
	        }
	      }
	    },
	    {
	      id: 1,
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

	          $scope.marker[1].options = {
	            draggable: true,
	            labelContent: "lat: " + $scope.coords.latitude + ' ' + 'lon: ' + $scope.coords.longitude,
	            labelAnchor: "100 0",
	            labelClass: "marker-labels"
	          };
	        }
	      }
	    }
	    ];

		console.log('Set Marker Called!', $scope.marker);
	}
		//Get Lake Data
			
			

			$scope.setCoords = function(){
			$scope.coords = {
				latitude : $scope.lake.geo.lat,
				longitude : $scope.lake.geo.lng
			}
			$scope.drawMap();
			$scope.setMarker();
		}

		

	uiGmapGoogleMapApi.then(function(maps) {
		$scope.askedForDirections = false;
		$scope.getLakeData = function(id){
				$lakes.getLake(id).then(function(data){
					$scope.lake = data.data;
					$scope.setCoords();
					
				});
			}
			$scope.polylines = [{
		        id: 1,
		        control: {},
		   		path: [],
		        stroke: {
		            color: '#6060FB',
		            weight: 5
		        },
		        clickable: false,
		        editable: false,
		        //draggable: false,
		        geodesic: true,
		        visible: true
		    }];
		
			$scope.getLakeData($scope.id);	
    });

    $scope.getDirections = function(){
    	$scope.askedForDirections = true;
    	$http.get("https://maps.googleapis.com/maps/api/directions/json?origin="+$scope.userCoords.latitude+","+$scope.userCoords.longitude+"&destination="+$scope.coords.latitude+","+$scope.coords.longitude+"&key="+$KEY).success(function(resp){
			console.log("Resp::", resp);
			var path = [];
			var steps = resp.routes[0].legs[0].steps;
			_.each(steps, function(step, index){
				var polyline = google.maps.geometry.encoding.decodePath(step.polyline.points);
				_.each(polyline, function(key, val){
					path.push(key);
				});
			});
			$scope.polylines = [{
		        id: 1,
		        control: {},
		   		path: path,
		        stroke: {
		            color: '#6060FB',
		            weight: 5
		        },
		        clickable: false,
		        editable: false,
		        //draggable: false,
		        geodesic: true,
		        visible: true
		    }];

		console.log($scope.polylines);
		});
    }


});
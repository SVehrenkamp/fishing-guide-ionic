app.controller('LakesController', function($scope, $rootScope, $lakes, coordinates, $ionicActionSheet, $location, $http){
	//ionic ui stuff
	$scope.listCanSwipe = true;
	// Triggered on a button click, or some other target
	$scope.show = function(lake) {

	   // Show the action sheet
	   var hideSheet = $ionicActionSheet.show({
	     buttons: [
	       { text: '<b>See Lake Details</b>' },
	       { text: 'Favorite' }
	     ],
	     titleText: lake.lakeName + 'Details',
	     cancelText: 'Cancel',
	     cancel: function() {
	          // add cancel code..
	        },
	     buttonClicked: function(index) {
	     	switch(index){
	     		case 0:
	     			$location.url('app/lakes/'+lake.id);
	     			break;
	     		case 1:
	     			$scope.favorite(lake);
	     			break;
	     	}
	       return true;
	     }
	   });
	}

	//lake stuff
	$scope.counties = ["Aitkin", "Anoka", "Becker ", "Beltrami ", "Benton ", "Big Stone ", "Blue Earth ", "Brown", "Carlton ", "Carver ", "Cass ", "Chippewa ", "Chisago ", "Clay ", "Clearwater ", "Cook ", "Cottonwood ", "Crow Wing", "Dakota ", "Dodge ", "Douglas  ", "Faribault ", "Fillmore ", "Freeborn", "Goodhue ", "Grant ", "Hennepin ", "Houston ", "Hubbard", "Isanti ", "Itasca  ", "Jackson", "Kanabec ", "Kandiyohi ", "Kittson ", "Koochiching", "Lac qui Parle ", "Lake ", "Lake of the Woods ", "Le Sueur ", "Lincoln ", "Lyon", "Mahnomen ", "Marshall ", "Martin ", "McLeod ", "Meeker ", "Mille Lacs ", "Morrison ", "Mower ", "Murray  ", "Nicollet ", "Nobles ", "Norman", "Olmsted ", "Otter Tail  ", "Pennington ", "Pine ", "Pipestone ", "Polk ", "Pope", "Ramsey ", "Red Lake ", "Redwood ", "Renville ", "Rice ", "Rock ", "Roseau", "Scott ", "Sherburne ", "Sibley ", "St. Louis ", "Stearns ", "Steele ", "Stevens ", "Swift", "Todd ", "Traverse  ", "Wabasha ", "Wadena ", "Waseca ", "Washington ", "Watonwan ", "Wilkin ", "Winona  ", "Wright  ", "Yellow Medicine "];
	$scope.coords = {
		lat : coordinates.latitude,
		lng : coordinates.longitude,
	};
	$scope.county;
	$scope.showLakesByCounty = function(county){
		$lakes.getLakesByCounty(county).then(function(resp){
			resp = resp.data.county;
			$scope.nearByLakes = resp;
			console.log(resp);
		});
	}
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
	$scope.favorite = function(lake){
		//alert(lake.lakeName);
		var data = {};
		data.lakeId = lake.id;
		data.userId = $rootScope.user.id;
		data.favorited_at = Date.now();
		console.log(data);
		$http.post($BASEURL+'/api/favorites', data).success(function(data){
			alert(lake.lakeName+" has been added to your hotspots!");
		});
	}
	$scope.showNearByLakes($scope.coords.str);
	$scope.showCoords();

});
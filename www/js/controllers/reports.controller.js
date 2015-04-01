app.controller('ReportsController', function($scope, $lakes, coordinates, $http){
	
	//Mock Data
	// $scope.data = [
 //      {name: "Greg", score: 98},
 //      {name: "Ari", score: 96},
 //      {name: 'Q', score: 75},
 //      {name: "Loser", score: 48}
 //    ];
	// $scope.moreData = [
 //      {name: "Greg", score: 8},
 //      {name: "Ari", score: 6},
 //      {name: 'Q', score: 16},
 //      {name: "Loser", score: 11}
 //    ];
 //    $scope.pieData = [
 //    	{"age":"One","population":5},
 //    	{"age":"Two","population":2},
 //    	{"age":"Three","population":9},
 //    	{"age":"Four","population":7},
 //    	{"age":"Five","population":4},
 //    	{"age":"Six","population":3},
 //    	{"age":"Seven","population":9}
 //    ];

$scope.watchID;
$scope.geoLoc;
$scope.loc = [];

$scope.showLocation = function(position) {
  console.log('Hello?');
  $scope.latitude = position.coords.latitude;
  $scope.longitude = position.coords.longitude;
  console.log("Latitude : " + $scope.latitude + " Longitude: " + $scope.longitude);

  var currentLoc = {
    lat : $scope.latitude,
    lng : $scope.longitude
  };
  $scope.$apply(function(){
    $scope.loc.push(currentLoc);
  });
  console.log('Yes');
}

function errorHandler(err) {
  if(err.code == 1) {
    console("Error: Access is denied!");
  }else if( err.code == 2) {
    console("Error: Position is unavailable!");
  }
}
$scope.getLocationUpdate = function(){

   if(navigator.geolocation){
      // timeout at 60000 milliseconds (60 seconds)
      var options = {timeout:30000};
      $scope.geoLoc = navigator.geolocation;
      $scope.watchID = $scope.geoLoc.watchPosition($scope.showLocation, 
                                     errorHandler,
                                     options);
      console.log('yes 2');
   }else{
      console.log("Sorry, browser does not support geolocation!");
   }
}
$scope.savePath = function(){
  var data = $scope.loc;
  $http.post($BASEURL+'/api/markers', data).success(function(resp){
    alert('Path Saved to Mongo!');
    console.log(resp);
  });
}
});
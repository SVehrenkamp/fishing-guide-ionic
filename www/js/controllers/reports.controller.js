app.controller('ReportsController', function($scope, $lakes, coordinates){
	
	//Mock Data
	$scope.data = [
      {name: "Greg", score: 98},
      {name: "Ari", score: 96},
      {name: 'Q', score: 75},
      {name: "Loser", score: 48}
    ];
	$scope.moreData = [
      {name: "Greg", score: 8},
      {name: "Ari", score: 6},
      {name: 'Q', score: 16},
      {name: "Loser", score: 11}
    ];
    $scope.pieData = [
    	{"age":"One","population":5},
    	{"age":"Two","population":2},
    	{"age":"Three","population":9},
    	{"age":"Four","population":7},
    	{"age":"Five","population":4},
    	{"age":"Six","population":3},
    	{"age":"Seven","population":9}
    ];

});
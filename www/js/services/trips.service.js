app.service('$trips', function($http){
	return {
		getTrips: function(params){
			var promise = $http.get('http://spothoppers.com/api/trips').success(function(response){
				//console.log(response);
				return response;
			});
			return promise;
		},
		getSnapshots: function(id){
			var promise = $http.get('http://spothoppers.com/api/snapshots?filter[where][tripId]='+id).success(function(response){
				//console.log(response);
				return response;
			});
			return promise;
		},
		createTrip: function(data){
			return $http.post('http://spothoppers.com/api/trips', data);
		},
		createSnapshot: function(data){
			return $http.post('http://spothoppers.com/api/snapshots/', data);

		}
	};
	
});
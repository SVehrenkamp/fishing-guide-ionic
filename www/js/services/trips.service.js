app.service('$trips', function($http){
	return {
		getTrips: function(params){
			var promise = $http.get('/api/trips').success(function(response){
				//console.log(response);
				return response;
			});
			return promise;
		},
		getSnapshots: function(id){
			var promise = $http.get('/api/snapshots?filter[where][tripId]='+id).success(function(response){
				//console.log(response);
				return response;
			});
			return promise;
		},
		createTrip: function(data){
			return $http.post('/api/trips', data);
		},
		createSnapshot: function(data){
			return $http.post('/api/snapshots/', data);

		}
	};
	
});
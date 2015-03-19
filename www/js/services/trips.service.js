app.service('$trips', function($http, $BASEURL){
	return {
		getTrips: function(params){
			var promise = $http.get($BASEURL+'/api/trips').success(function(response){
				//console.log(response);
				return response;
			});
			return promise;
		},
		getSnapshots: function(id){
			var promise = $http.get($BASEURL+'/api/snapshots?filter[where][tripId]='+id).success(function(response){
				//console.log(response);
				return response;
			});
			return promise;
		},
		createTrip: function(data){
			return $http.post($BASEURL+'/api/trips', data);
		},
		createSnapshot: function(data){
			return $http.post($BASEURL+'/api/snapshots/', data);

		}
	};
	
});
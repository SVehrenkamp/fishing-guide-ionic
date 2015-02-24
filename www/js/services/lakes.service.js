app.service('$lakes', function($http){
	return {
		getAllLakes: function(params){
			var promise = $http.get('/api/lakes').success(function(response){
				//console.log(response);
				return response;
			});
			return promise;
		},
		getNearByLakes: function(params){
			var promise = $http.get('/api/lakes/nearBy?location='+params).success(function(response){
			    return response;
			});
			return promise;
		},
		getLakesByCounty: function(params){
			var promise = $http.get('/api/lakes/county?county='+params).success(function(response){
			    return response;
			});
			return promise;
		}
	};
	
});
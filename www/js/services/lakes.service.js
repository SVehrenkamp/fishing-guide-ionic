app.service('$lakes', function($http){
	return {
		getAllLakes: function(params){
			var promise = $http.get('http://localhost:3000/api/lakes').success(function(response){
				//console.log(response);
				return response;
			});
			return promise;
		},
		getNearByLakes: function(params){
			var promise = $http.get('http://localhost:3000/api/lakes/nearBy?location='+params).success(function(response){
			    return response;
			});
			return promise;
		}
	};
	
});
app.service('$lakes', function($http, $BASEURL){
	return {
		getAllLakes: function(params){
			var promise = $http.get($BASEURL+'/api/lakes').success(function(response){
				//console.log(response);
				return response;
			});
			return promise;
		},
		getNearByLakes: function(params){
			var promise = $http.get($BASEURL+'/api/lakes/nearBy?location='+params).success(function(response){
			    return response;
			});
			return promise;
		},
		getLakesByCounty: function(params){
			var promise = $http.get($BASEURL+'/api/lakes/county?county='+params).success(function(response){
			    return response;
			});
			return promise;
		},
		getLake: function(id){
			var promise = $http.get($BASEURL+'/api/lakes/'+id).success(function(response){
				return response;
			});
			return promise;
		}
	};
	
});
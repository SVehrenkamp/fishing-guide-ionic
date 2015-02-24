app.factory('$forecast', function($http,$q, ipCookie, coordinates){
	
	return {
		//convert bearing to cardinal direction
		getWindDirection : function(bearing, direction){
			switch(true){
				case (bearing < 22.5):
					direction = "N";
					break;
				case (bearing < 45):
					direction = "NNE";
					break;
				case (bearing < 67.5):
					direction = "NE";
					break;
				case (bearing < 90):
					direction = "E";
					break;
				case (bearing  < 112.5):
					direction = "ESE";
					break;
				case (bearing < 135):
					direction = "SE";
					break;
				case (bearing < 157.5):
					direction = "SSE";
					break;
				case (bearing < 180):
					direction = "S";
					break;
				case (bearing < 202.5):
					direction = "SSW";
					break;
				case (bearing < 225):
					direction = "SW";
					break;
				case (bearing < 247.5):
					direction = "WSW";
					break;
				case (bearing < 270):
					direction = "W";
					break;
				case (bearing < 292.5):
					direction = "WNW";
					break;
				case (bearing < 315):
					direction = "NW";
					break;
				case (bearing < 337.5):
					direction = "NNW";
					break;
				case (bearing < 360):
					direction = "N";
					break;
			}
			return direction;
		},

		getPressureInches : function(millibars){
			return (millibars  * 0.0295301);
		},

		getWeather: function(params){
			var that = this,
				lat = coordinates.latitude, 
				long = coordinates.longitude,
				deferred = $q.defer(),
				url = '/forecast/'+lat+','+long;
			$http.get(url).success(function(response){
			
			var pressureIN = that.getPressureInches(response.currently.pressure);
			var windBearing = response.currently.windBearing;
			var windDirection = that.getWindDirection(windBearing);
				
			console.log(response);
				deferred.resolve({
					data: {
						start_time: response.currently.time,
						origin : {
							latitude : coordinates.latitude,
							longitude : coordinates.longitude,
							timezone: response.timezone
						}
					},
					snapshot : {
						origin : {
							latitude : coordinates.latitude,
							longitude : coordinates.longitude
						},
						sunrise: response.daily.data[0].sunriseTime,
						sunset: response.daily.data[0].sunsetTime,
						moonPhase: response.daily.data[0].moonPhase,
						temperature : Math.round(response.currently.temperature),
						dewpoint : Math.round(response.currently.dewPoint),
						
						humidity : (response.currently.humidity*100+"%"),
						pressure : {
							mb : response.currently.pressure,
							in : Math.round(pressureIN*100)/100
						},
						condition : response.currently.summary,
						wind : {
							speed : Math.round(response.currently.windSpeed),
							direction : windDirection
						}
					}

				
				});
			});
			console.log('Promise::',deferred);
			return deferred.promise;
		}
	};
	
});
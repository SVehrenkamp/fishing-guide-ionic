var request = require('request');
var _ = require('underscore');
var app = require('../../server/server.js');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var Trip = app.models.trip;
var Snapshot = app.models.snapshot;

//Get Weather Data
function isWorking(params){
	console.log("Its working!", params);
}
//convert bearing to cardinal direction
function getWindDirection(bearing, direction){
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
}

function getPressureInches(millibars){
	return (millibars  * 0.0295301);
}

function formatWeather(response, coords){
	response = JSON.parse(response);
	
	var coords = coords.split(','),
		lat = coords[0], 
		lng = coords[1];
	
	var pressureIN = getPressureInches(response.currently.pressure);
	var windBearing = response.currently.windBearing;
	var windDirection = getWindDirection(windBearing);
		
	response = {
		data: {
				start_time: response.currently.time,
				origin : {
					geo: {
						lat : lat,
						lng : lng,
					},
					timezone: response.timezone
				},
				moon_phase: response.daily.data[0].moonPhase,
				sunrise: response.daily.data[0].sunriseTime,
				sunset: response.daily.data[0].sunsetTime
				
			},
			snapshot : {
				origin : {
					geo: {
						lat : lat,
						lng : lng
					}
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
		};
		return response;
		
	
}
function formatHistory(response, coords, data){
	
	var coords = coords.split(','),
		lat = coords[0], 
		lng = coords[1];
	
	var pressureIN = getPressureInches(response.pressure);
	var windBearing = response.windBearing;
	var windDirection = getWindDirection(windBearing);
	response = {
			snapshot : {
				tripId: data.id,
				timestamp: response.time,
				origin : {
					geo: {
						lat : lat,
						lng : lng
					}
				},
				sunrise: data.sunrise,
				sunset: data.sunset,
				moon_phase: data.moonPhase,
				temperature : Math.round(response.temperature),
				dewpoint : Math.round(response.dewPoint),
				
				humidity : (response.humidity*100+"%"),
				pressure : {
					mb : response.pressure,
					in : Math.round(pressureIN*100)/100
				},
				condition : response.summary,
				wind : {
					speed : Math.round(response.windSpeed),
					direction : windDirection
				}
			}
		};
		return response;
		
	
}

///
module.exports = {
	test: function(params){
		isWorking(params);
	},

	findAllSnapshots: function(){
		Snapshot.find(function(err, results){
			console.log(results);
		});
	},
	createSnapshot: function(data, cb){
		Snapshot.create(data, function(err, obj){
			if(err){
				console.log(err)
			} else{
				console.log(obj)
			}
		});
	},
	createTrip: function(data, coords, cb){
		var self = this;
		Trip.create(data.data, function(err, obj){
			if(err){
				console.log("ERROR",err);
			} else{
				var id = obj._id;
				data.snapshot.tripId = id;
				data.snapshot.timestamp = Math.round(Date.now()/1000);
				//self.createSnapshot(data.snapshot);
				console.log("Created Trip and Snapshot");
	        	//self.getHistory(coords, id);
			}
			return cb(data);
		});
	},
	getWeather: function(req, res, id){
		var self = this;
		var coords = req.params.coords;
		var url = "https://api.forecast.io/forecast/24afef7e6da9ac9b4819107bd7a9f4b0/"+coords;
	  request({
	      //request settings
	      url: url

	    },function(err, response, body){

	        if(err){
	          //if error
	          console.log('Error! getWeather reports: ', err);
	        } else {
	        	//Parse Response
	        	body = formatWeather(body, coords);
	        	//Create New Trip Record in the Database
	        	self.createTrip(body, coords, function(data){
		        	app.emit('createHistory', data, coords);
		        	//Convert parsed Response Object to string
		        	body = JSON.stringify(data);

		        	//Write parsed response to response body
		        	res.write(body);
		        	res.end();
	        	console.log('Finished::');
	        	});
	        	//Return
	        	return body;
	        }
	    //end request
	    });
	},
	getSnapshot: function(req, res){
		var self = this,
			coords = req.params.coords,
			url = "https://api.forecast.io/forecast/24afef7e6da9ac9b4819107bd7a9f4b0/"+coords;
	  		
	  		request({
	      //request settings
	      url: url

	    },function(err, response, body){

	        if(err){
	          //if error
	          console.log('Error! getWeather reports: ', err);
	        } else {
	        	//Parse Response
	        	body = formatWeather(body, coords);
	        	body = JSON.stringify(body);

	        	//Write parsed response to response body
	        	res.write(body);
	        	res.end();
        		console.log('Finished::');
	        	//Return
	        	return body;
	        }
	    //end request
	    });
	},
	getHistory: function(coords, id){
	  var self = this,
	  	  tripId = id,
	  	  date = Math.floor((new Date).getTime()/1000),
	      previousDate = (date - 86400),
	      url = "https://api.forecast.io/forecast/24afef7e6da9ac9b4819107bd7a9f4b0/"+coords+","+previousDate;

	  request({
	      //request settings
	      url: url

	    },function(err, response, body){

	        if(err){
	          //if error
	          console.log('Error! getHistory reports: ', err);
	        } else {
	        	//Parse Response
	        	self.parseHistory(body, coords, tripId);
	        	return body;
	        }
	    //end request
	    });
	},
	parseHistory: function(body, coords, id){
		var self = this;
		console.log(typeof(body));
		body = JSON.parse(body);
		var data = {};
		data.id = id;
		data.sunrise = body.daily.data[0].sunriseTime;
		data.sunset = body.daily.data[0].sunsetTime;
		data.moonPhase = body.daily.data[0].moonPhase;
		
		_.each(body.hourly.data, function(val, index){
			var snap = formatHistory(val, coords, data);
			self.createSnapshot(snap.snapshot);
		});
	}
}
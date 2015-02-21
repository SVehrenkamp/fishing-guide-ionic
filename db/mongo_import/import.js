var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/History');

var db = mongoose.connection;

if(db){
	console.log("Connected to MongoDB!!!");
}

var lakes = require('./formattedLakes');

var Lake = mongoose.model(
	'Lake',
	mongoose.Schema({
		'DOWLKNUM': String,
		'lakeName': String,
		'altName': String,
		'rivName': String,
		'launchName': String,
		'launchType': String,
		'rampType': String,
		'numRamps': String,
		'numToilets': String,
		'dataUpdate': String,
		'acres': String,
		'county': String,
		'geo': Object
	})
);

Lake.find({}, function(err, entries){
	for(var i = 0; i < entries.length; i++){
		entries[i].remove();
	}
	for(var i = 0; i < lakes.length; i++){
		var lake = new Lake({
			'DOWLKNUM': lakes[i].DOWLKNUM,
			'lakeName': lakes[i].lakeName,
			'altName': lakes[i].altName,
			'rivName': lakes[i].rivName,
			'launchName': lakes[i].launchName,
			'launchType': lakes[i].launchType,
			'rampType': lakes[i].rampType,
			'numRamps': lakes[i].numRamps,
			'numToilets': lakes[i].numToilets,
			'dataUpdate': lakes[i].dataUpdate,
			'acres': lakes[i].acres,
			'county': lakes[i].county,
			'geo': lakes[i].geo
		});
		lake.save(function(err, entry){
			if(err){
				console.log("Error on lake save!");
			}
		});
	}
	console.log("Import finished without errors! Press CTRL+C to exit!");
});

module.exports = function(Snapshot) {

	//Return all snapshot temperatures as an array for a given tripID
	Snapshot.getAllTemps = function(tripID, cb){
		Snapshot.find({where: {tripId: tripID}}, function(err, results) {
			var total = results.length;
			var temps = [];
			for(var i = 0; i < total; i++){
				temps.push(results[i].temperature)
			}
			cb(null, temps);
		});
	}

	//Return all snapshots when a fish was caught for a given tripID
	Snapshot.getAllFish = function(tripID, cb){
		Snapshot.find({where: {tripId: tripID, fish:{neq:null}}}, function(err, results){
			var total = results.length;
			var fish = {};
			fish.snapshots = [];
			fish.totalFish = results.length;
			for(var i = 0; i < total; i++){

				fish.snapshots.push(results[i]);
			}
			cb(null, fish);
		});
	}

	//Define Custom Remote Methods
	Snapshot.remoteMethod (
        'getAllTemps',
        {
          http: {path: '/getAllTemps', verb: 'get'},
          accepts: {arg: 'tripID', type: 'string', http: { source: 'query' } },
          returns: {arg: 'temps', type: 'array'}
        }
    );
    Snapshot.remoteMethod (
        'getAllFish',
        {
          http: {path: '/getAllFish', verb: 'get'},
          accepts: {arg: 'tripID', type: 'string', http: { source: 'query' } },
          returns: {arg: 'fish', type: 'array'}
        }
    );
};

module.exports = function(Lakes) {
    ///////////////////////////////////
    //BELOW IS FORMATTED FOR EMBER DATA
    ///////////////////////////////////
    // Lakes.afterRemote('**', function (ctx, lake, next) {
    //   if(ctx.result) {
    //     if(Array.isArray(ctx.result)) {
    //       ctx.result = { 'lakes': lake };
    //     } else {
    //       ctx.result = { 'lake': lake };
    //     }
    //   }
      
    //   console.log(ctx.result);
      
    //   next();
    // });

  var GeoPoint = require('loopback').GeoPoint;

  //Return all snapshots when a fish was caught for a given tripID
  Lakes.nearBy = function(location, cb){
    Lakes.find({where: {geo: {near: location} }, limit: 5 }, function(err, results){
      var lakes = [];
      for(var i = 0; i < results.length; i++){
        var lake = {};
        lake[i] = results[i];
        lake[i].distance = Math.round(GeoPoint.distanceBetween(location, results[i].geo, {type: 'miles'})*100)/100;
        lakes.push(lake);
      }
      cb(null, lakes);
    });
  };
  Lakes.hello = function(cb){
    var msg = "Hello";
    cb(null, msg);
  };
  

  //Define Custom Remote Methods
  Lakes.remoteMethod (
        'nearBy',
        {
          http: {path: '/nearBy', verb: 'get'},
          accepts: {arg: 'location', type: 'string', http: { source: 'query' } },
          returns: {arg: 'nearBy', type: 'array'}
        }
    );
   Lakes.remoteMethod (
        'hello',
        {
          http: {path: '/hello', verb: 'get'},
          returns: {arg: 'hello', type: 'array'}
        }
    );
};

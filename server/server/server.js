var loopback = require('loopback');
var boot = require('loopback-boot');
var proxy = require('simple-http-proxy');
//var request = require('request');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var coords;

var app = module.exports = loopback();

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);

var weatherService = require('../middlewares/weather-service/index.js');

var path = require('path');
//App Entry Point index.html file
app.use(loopback.static(path.resolve(__dirname, '../../www')));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};


//  app.use('/forecast/:coords', proxy('https://api.forecast.io/forecast/24afef7e6da9ac9b4819107bd7a9f4b0/', {
//   onrequest: function(options, req){
//   	options.path += req.params.coords;
//     coords = req.params.coords;
//     return this;
//   },
//   onresponse: function(msg, resp){
//     //console.log(resp);
//     weatherService.getHistory(coords);
//   }
// }));

app.use('/createtrip/:coords', loopback.bodyParser(), function(req, res){
  //console.log('ParsedBody::', req.body);
  weatherService.getWeather(req, res);
}); 

app.use('/weather/:coords', function(req, res){
  weatherService.getSnapshot(req, res);
}); 


app.on('createHistory', function(data, coords){
  console.log('Event Caught', data, coords);
  weatherService.createSnapshot(data.snapshot);
  weatherService.getHistory(coords, data.snapshot.tripId, data.snapshot.user_id, data.snapshot.lake);
});

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}

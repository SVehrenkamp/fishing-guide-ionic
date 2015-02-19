var loopback = require('loopback');
var boot = require('loopback-boot');
var proxy = require('simple-http-proxy');

var app = module.exports = loopback();

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);


var path = require('path');
//App Entry Point index.html file
app.use(loopback.static(path.resolve(__dirname, '../client')));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};


 app.use('/forecast/:coords', proxy('https://api.forecast.io/forecast/24afef7e6da9ac9b4819107bd7a9f4b0/', {
  onrequest: function(options, req){
  	options.path += req.params.coords;
    return this;
  },
  onresponse: function(msg, resp){
    //console.log(resp);
  }
}));



// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}

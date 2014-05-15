
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var parse = require('parse').Parse;
parse.initialize("wJgTTR7HF7a0uUlc5IqyZVwL0IbCfk6WD9QRNdFf", "govCyUnlBTYzWW6PO6zhbAVOtwtdFS6r6HJ4e5u0");
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require("./routes/index").registerRoutes(app, parse);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port '+app.get('port'));
});

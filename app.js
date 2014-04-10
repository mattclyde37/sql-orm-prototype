
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var compiler = require('./compiler');
var db = require('./db');
var routes = require('./routes');

compiler.compile();

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Big secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Setup database
var sequelize = db.connect();
db.define(app, sequelize);

// Setup API routes
routes.init(app);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

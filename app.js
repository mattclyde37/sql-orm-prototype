
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var compiler = require('./compiler');
var db = require('./db');
var user =  require('./db/models/user');

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

var sequelize = db.connect();
user.define(app, sequelize);


app.post('/login', function (req, res){
    authenticate(req.body.username, req.body.pass, function (err, result){
        if (!!err)
            res.status(500).send({success: false, message: err.toString()});
        else{
            if (!result.user && result.error){
                res.send({success: false, message: result.error});
            } else {
                // Successful login
                req.session.userId = result.user.id;
                res.send({success: true})
            }
        }
    });
});

app.get('/logout', function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
        res.redirect('/');
    });
});

app.get('/isLoggedIn', function (req, res){
    if (req.session.userId) {
        user.findUser({id: req.session.userId}, function (err, user){
            // ignoring if there's an error here... may not want to do that
            res.send({loggedIn: true, username: user.username});
        });
    }
    else
        res.send({loggedIn: false});
});



app.get('/forbidden', function (req, res){
    res.status(403).send('Forbidden route');
});

app.all('/api/*', requireAuthentication);

function requireAuthentication(req, res, next){
    if (req.session.userId)
        next();
    else
        res.status(401).send('Please log in');
}



// Authentication
function authenticate (username, pass, handler){
    user.findUser({username: username}, function (err, user){
        if (!!err)
            handler(new Error('Error finding user'));
        else if (!user)
            handler(null, {error: 'Could not find user', user: null});
        else{
            if (user.password === pass)
                handler(null, {user: user});
            else
                handler(null, {error: 'Invalid password', user: null});
        }
    });
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// Session

exports.init = function (app){

    var User = app.get('User');

    // Authentication
    var authenticate = function (username, pass, handler){
        User.findUser({username: username}, function (err, user){
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
    };


    app.post('/login', function (req, res){
        authenticate(req.body.username, req.body.pass, function (err, result){
            if (!!err)
                res.status(500).send({success: false, message: err.toString()});
            else{
                if (!result.user && result.error){
                    res.send({success: false, message: result.error});
                } else {
                    // Successful login
                    req.session.user = result.user;
                    res.send({success: true, user: result.user})
                }
            }
        });
    });

    app.get('/logout', function(req,res){
        // destroy the user's session to log them out
        // will be re-created next request
        req.session.destroy(function(){
            res.redirect('/');
        });
    });

    app.get('/user', function (req,res){
        if (req.session.user) {
            res.send(req.session.user);
        }
        else
            res.status(401).send();
    });



};
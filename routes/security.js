

exports.init = function (app){

    var requireAuthentication = function (req, res, next){
        if (req.session.user)
            next();
        else
            res.status(401).send('Please log in');
    };

    app.all('/api/*', requireAuthentication);

    app.use(function(err, req, res, next) {
        console.log(err);
        res.send(err);
    });

};
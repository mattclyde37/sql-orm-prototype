var User;

exports.define = function(app, sequelize){
    var Sequelize = require('sequelize');
    // Define table 'User'
    User = sequelize.define('User', {
        id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: Sequelize.STRING,
        password: {},
        role_code: {}
    });

    sequelize
        .sync({ force: false })
        .complete(function(err) {
            if (!!err) {
                console.log('An error occurred while create the table:', err)
            } else {
                console.log('User table defined')
            }
        });

    app.set('User', User);

    defineApi(app);
};


// Adds a user with the supplied username and password
function addUser (name, password, isAdmin, handler) {
    User.create({
        username: name,
        password: password,
        isAdmin: isAdmin
    })
        .complete(function (err, user){
            if (!!err) {
                handler(err);
            } else{
                handler(null, user);
            }
    });
};


// Finds a user by username
function findUser (whereValues, handler){
    User.find({
        where: whereValues
    })
        .complete(function (err, user){
            if (!!err){
                handler(err);
            } else if (!user){
                handler(null, null);
            } else {
                handler(null, user);
            }
        });
};
// This is used while authenticating a user
exports.findUser = findUser;


// Finds all users
function allUsers (handler){
    User.findAll()
        .complete(function (err, users){
            if (!!err){
                handler(err);
            } else if (!users){
                handler(null, null);
            } else {
                handler(null, users);
            }
        });
};

function removeUser(whereValues, handler) {
    findUser(whereValues, function(err, user){
        if (!!err){
            handler(err, null);
        }
        if (!user){
            handler(null, null);
        } else{
            user.destroy()
                .complete(function (){
                    handler(null, {success: true});
                });
        }
    });
}

function updateUser(setValues, whereValues, handler){
    User.update(setValues, whereValues)
        .success(function (affectedUsers){
            handler(null, affectedUsers);
        })
        .error(function (err){
            handler(err, null);
        });
}


function defineApi(app){

    app.post('/api/addUser', function (req, res){
        addUser(req.body.username, req.body.password, req.body.isAdmin, function (err, user){
            if (!!err){
                res.status(500).send('Error while adding user');
            } else {
                res.send(user);
            }
        });
    });

    app.post('/api/removeUser', function (req, res){
        removeUser({username: req.body.username}, function(err, result){
            if (!!err){
                res.status(500).send('Error while removing user');
            } else {
                res.send(result);
            }
        }) ;
    });

    app.get('/api/findUser', function (req, res){
        findUser({username: req.query.username}, function (err, user){
            if (!!err){
                res.status(500).send('Error while finding user: ' + req.body.username);
            } else {
                res.send(user);
            }
        });
    });

    app.get('/api/allUsers', function (req, res){
        allUsers(function (err, users){
            if (!!err){
                res.status(500).send('Error while finding all users');
            } else {
                res.send(users);
            }
        });
    });

    app.post('/api/updateUsername', function (req, res){
        if (req.body.username && req.body.id) {
            var update = {username: req.body.username}
            updateUser(update, {id: req.body.id}, function (err, affectedUsers) {
                if (!!err) {
                    res.status(500).send('Error while updating username');
                } else {
                    res.send(affectedUsers);
                }
            });
        }
    });

    app.post('/admin/updateUserRole', requireAdmin, function (req, res){
        if (req.body.id){
            var update = {isAdmin: req.body.isAdmin};
            updateUser(update, {id: req.body.id}, function(err, affectedUsers){
                if (!!err)
                    res.status(500).send('Error while updating user');
                else
                    res.send(affectedUsers);
            });
        }else{
            res.send(0);
        }
    });

}



function requireAdmin (req, res, next){
    if (req.session.userId){
        findUser({id: req.session.userId}, function (err, user){
            if (user && user.isAdmin)
                next();
            else
                res.status(403).send('Permissions denied');
        });
    } else {
        res.status(401).send('Please log in');
    }
}
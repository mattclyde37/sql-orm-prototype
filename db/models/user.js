var User;

exports.define = function(app, sequelize){
    var Sequelize = require('sequelize');
    // Define table 'User'
    User = sequelize.define('User', {
        id: { type: Sequelize.UUID, allowNull: false },
        username: Sequelize.STRING(64),
        password: Sequelize.STRING(64),
        role_code: Sequelize.STRING(1)
    }, {
        tableName: 'User',
        timestamps: false
    });

    User.findUser = findUser;

    app.set('User', User);

    defineApi(app);

    return User;
};




// Adds a user with the supplied username and password
function addUser (name, password, isAdmin, handler) {
    var uuid = require('node-uuid');
    var role = isAdmin ? 'a' : 'u';
    User.create({
        id: uuid.v4(),
        username: name,
        password: password,
        role_code: role
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

    var userTypes = require('../userTypes').get();

    app.post('/api/addUser', userTypes.any(userTypes.all), function (req, res){
        addUser(req.body.username, req.body.password, req.body.isAdmin, function (err, user){
            if (!!err){
                res.status(500).send('Error while adding user');
            } else {
                res.send(user);
            }
        });
    });

    app.post('/api/removeUser', userTypes.any(userTypes.all), function (req, res){
        removeUser({username: req.body.username}, function(err, result){
            if (!!err){
                res.status(500).send('Error while removing user');
            } else {
                res.send(result);
            }
        }) ;
    });

    app.get('/api/findUser', userTypes.any(userTypes.all), function (req, res){
        findUser({username: req.query.username}, function (err, user){
            if (!!err){
                res.status(500).send('Error while finding user: ' + req.body.username);
            } else {
                res.send(user);
            }
        });
    });

    app.get('/api/allUsers', userTypes.any(userTypes.all), function (req, res){
        allUsers(function (err, users){
            if (!!err){
                res.status(500).send('Error while finding all users');
            } else {
                res.send(users);
            }
        });
    });

    app.post('/api/updateUsername', userTypes.any(userTypes.all), function (req, res){
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

    app.post('/admin/updateUserRole', userTypes.is(userTypes.Admin), function (req, res){
        if (req.body.id){
            var role = 'u';
            if (req.body.isAdmin)
                role = 'a';
            var update = {role_code: role};
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
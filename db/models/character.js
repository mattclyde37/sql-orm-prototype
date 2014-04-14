var Character;

exports.define = function(app, sequelize){
    var Sequelize = require('sequelize');

    // Define table 'Character'
    Character = sequelize.define('Character', {
        id: { type: Sequelize.UUID, allowNull: false },
        name: Sequelize.STRING(128),
        context: Sequelize.STRING(128),
        added_on: Sequelize.DATE
    }, {
        tableName: 'Person',
        timestamps: false
    });

    app.set('Character', Character);

    defineApi(app);

    return Character;
};





function defineApi (app){

    var uuid = require('node-uuid');
    var userTypes = require('../userTypes').get();

    app.get('/api/characters', userTypes.any(userTypes.all), function (req, res){
        Character.findAll()
            .success(function (characters){
                res.send(characters);
            })
            .error(function (err){
                res.status(500).send(err);
            })
    });

    app.get('/api/characters/:id', userTypes.any(userTypes.all), function (req, res){
        if (req.params.id) {
            Character.find({ where: {id: req.params.id}})
                .success(function (character){
                    res.send(character);
                })
                .error(function (err){
                    res.status(500).send(err);
                })
        }
        else
            res.status(400).send();
    });

    app.post('/api/characters', userTypes.any(userTypes.all), function (req, res){
        if (req.body.name){
            Character.create({
                id: uuid.v4(),
                name: req.body.name,
                context: req.body.context
            })
                .success(function (character) {
                    res.send(character);
                })
                .error(function (err){
                    res.status(500).send(err);
                })
        }
        else
            res.send(400).send();
    });

    app.put('/api/characters/:id', userTypes.any(userTypes.all), function (req, res){
        if (req.params.id){
            var setValues = {};
            if (req.body.name)
                setValues.name = req.body.name;
            if (req.body.context)
                setValues.context = req.body.context;
            Character.update(setValues, {id: req.params.id})
                .success(function (affectedCharacter){
                    res.send(affectedCharacter);
                })
                .error(function (err){
                    res.status(500).send(err);
                })
        }else
            res.status(400).send();
    });

    app.delete('/api/characters/:id', userTypes.any(userTypes.all), function (req, res){
        if (req.params.id){
            Character.find({ where: req.params.id})
                .success(function (character){
                    character.destroy()
                        .success(function (){
                            res.send({success: true});
                        })
                        .error(function (){
                            res.status(500).send(err);
                        })
                })
                .error(function (err){
                    res.status(500).send(err);
                })
        }
        else
            res.status(400).send('Please provide an id');
    });


    app.get('/api/characters/:id/quotes', userTypes.any(userTypes.all), function (req, res){
        if (req.params.id){
            Character.find({where: {id: req.params.id}})
                .success(function (character){
                    character.getQuotes()
                        .success(function (quotes){
                            res.send(quotes);
                        })
                        .error(function (err){
                            res.status(500).send(err);
                        })
                })
                .error(function(err){
                    res.status(500).send(err);
                })
        }else
            res.status(400).send('Please provide and character id');
    });

}

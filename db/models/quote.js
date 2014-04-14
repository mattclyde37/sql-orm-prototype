var Quote;

exports.define = function(app, sequelize){
    var Sequelize = require('sequelize');

    // Define table 'Quote'
    Quote = sequelize.define('Quote', {
        id: { type: Sequelize.UUID, allowNull: false },
        text: Sequelize.STRING(4096),
        character_id: Sequelize.UUID,
        user_id: Sequelize.UUID
    }, {
        tableName: 'Quote',
        timestamps: false
    });

    app.set('Quote', Quote);

    defineApi(app);

    return Quote;
};



function defineApi (app){

    var uuid = require('node-uuid');
    var userTypes = require('../userTypes').get();

    app.get('/api/quote/findAll', userTypes.any(userTypes.all), function (req, res){
        Quote.findAll()
            .success(function (quotes){
                res.send(quotes);
            })
            .error(function (err){
                res.status(500).send(err);
            })
    });

    app.get('/api/quote/find', userTypes.any(userTypes.all), function (req, res){
        if (req.param('id')) {
            Quote.find({ where: req.param('id')})
                .success(function (quote){
                    res.send(quote);
                })
                .error(function (err){
                    res.status(500).send(err);
                })
        }
        else
            res.status(400).send('Please provide an id');
    });

    app.post('/api/quote/add', userTypes.any(userTypes.all), function (req, res){
        if (req.body.text){
            var newQuote = {
                id: uuid.v4(),
                added_on: Date.now(),
                text: req.body.text
            };

            if (req.body.character_id)
                newQuote.character_id = req.body.character_id;
            if (req.session.user)
                newQuote.user_id = req.session.user.id;

            Quote.create(newQuote)
                .success(function (quote) {
                    res.send(quote);
                })
                .error(function (err){
                    res.status(500).send(err);
                })
        }
        else
            res.send(400).send();
    });

    app.post('/api/quote/update', userTypes.any(userTypes.all), function (req, res){
        if (req.body.id){
            var setValues = {};
            if (req.body.text)
                setValues.text = req.body.text;
            if (req.body.character_id)
                setValues.character_id = req.body.character_id;
            if (req.body.user_id)
                setValues.user_id = req.body.user_id;

            Quote.update(setValues, {id: req.body.id})
                .success(function (affectedQuote){
                    res.send(affectedQuote);
                })
                .error(function (err){
                    res.status(500).send(err);
                })
        }else
            res.status(400).send();
    });

    app.delete('/api/quote/delete', userTypes.any(userTypes.all), function (req, res){
        if (req.body.id){
            Quote.find({ where: {id: req.body.id}})
                .success(function (quote){
                    quote.destroy()
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
            res.status(400).send();
    });


}

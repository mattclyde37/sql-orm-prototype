
// Connects to a sqlite database named text_db with credentials:
// username: username, password: password

exports.connect = function (){
    // setup database connection
    /*
    var Sequelize = require('sequelize')
        , sequelize = new Sequelize('test_db', 'username', 'password', {
            dialect: "sqlite",
            port:    3306, // or 5432 (for postgres)
            storage: './db/test_db.sqlite' // path to the database
        });
        */

    var Sequelize = require('sequelize')
        , sequelize = new Sequelize('demodb', 'demouser', 'demo', {
            dialect: "mysql",
            host: '162.244.26.119',
            port:    3306 // or 5432 (for postgres)
        });

    sequelize
        .authenticate()
        .complete(function(err) {
            if (!!err) {
                console.log('Unable to connect to the database:', err)
            } else {
                console.log('Connection has been established successfully.')
            }
        });

    return sequelize;
};

exports.define = function (app, sequelize){
    var user = require('./models/user');
    var character = require('./models/character');
    var quote = require('./models/quote');
    var comment = require('./models/comment');

    // Define all the models
    var User = user.define(app, sequelize);
    var Character = character.define(app, sequelize);
    var Quote = quote.define(app, sequelize);
    var Comment = comment.define(app, sequelize);


    // Quote Associations
    Quote.belongsTo(Character);
    Quote.belongsTo(User);
    Character.hasMany(Quote, {foreignKey: 'character_id'});
    User.hasMany(Quote, {foreignKey: 'user_id'});


    // Comment Associations
    Comment.belongsTo(Quote);
    Comment.belongsTo(User);
    Quote.hasMany(Comment, {foreignKey: 'quote_id'});
    User.hasMany(Comment, {foreignKey: 'user_'});




};
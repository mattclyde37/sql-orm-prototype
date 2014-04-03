
// Connects to a sqlite database named text_db with credentials:
// username: username, password: password

exports.connect = function (){
    var Sequelize = require('sequelize')
        , sequelize = new Sequelize('test_db', 'username', 'password', {
            dialect: "sqlite", // or 'mysql', 'postgres', 'mariadb'
            port:    3306, // or 5432 (for postgres)
            storage: './test_db.sqlite' // path to the database
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
var Comment;

exports.define = function(app, sequelize){
    var Sequelize = require('sequelize');

    // Define table 'Comment'
    Comment = sequelize.define('Comment', {
        id: { type: Sequelize.UUID, allowNull: false },
        text: Sequelize.STRING(4096),
        quote_id: Sequelize.UUID,
        user_id: Sequelize.UUID
    }, {
        tableName: 'Comment',
        timestamps: false
    });

    app.set('Comment', Comment);

    defineApi(app);

    return Comment;
};



function defineApi (app){

}

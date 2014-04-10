
/*
 * GET home page.
 */

exports.init = function(app){

    var security = require('./security');
    var session = require('./session');

    security.init(app);
    session.init(app);


};
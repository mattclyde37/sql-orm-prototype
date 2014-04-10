
// User Types and Permission checking middleware

exports.get = function () {
    return {
        any: function (types) {
            return function (req, res, next) {
                if (types.indexOf(req.session.user.role_code) != -1) {
                    return next();
                } else {
                    res.status(403).send('Permission Denied');
                }
            }
        },
        is: function (type) {
            return function (req, res, next) {
                if (req.session.user.role_code == type) {
                    return next();
                } else {
                    res.status(403).send('Permission Denied');
                }
            }
        },
        User: 'u',
        Admin: 'a',
        Developer: 'd',
        all: ['u', 'a', 'd']
    }
};
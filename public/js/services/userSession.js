angular.module('sql-prototype')
    .service('UserSession', UserSessionService);

function UserSessionService ($http){

    var _user = null;
    $http.get('/user')
        .success(function (user){
            _user = user;
        })
        .error(function (err){
        });

    this.desiredState = 'home';

    this.login = function(username, pass, handler){
        $http.post('/login', {username: username, pass: pass})
            .success(function (result){
                if (result.success)
                    _user = result.user;
                else {
                    _user = null;
                }
                handler(result.success, result.message);
            });
    };

    this.logout = function (handler){
        $http.get('/logout')
            .success(function (result){
                _user = null;
                handler(result);
            });
    };

    this.isLoggedIn = function(){
        return _user !== null;
    };

}


angular.module('sql-prototype')
    .service('UserSession', UserSessionService);

function UserSessionService ($http){

    var _loggedIn = false;
    $http.get('/isLoggedIn')
        .success(function (result){
            _loggedIn = result.loggedIn;
        });

    this.desiredState = 'home';

    this.login = function(username, pass, handler){
        $http.post('/login', {username: username, pass: pass})
            .success(function (result){
                if (result.success)
                    _loggedIn = true;
                else {
                    _loggedIn = false;
                }

                handler(result.success, result.message);
            });
    };

    this.logout = function (handler){
        $http.get('/logout')
            .success(function (result){
                _loggedIn = false;
                handler(result);
            });
    };

    this.isLoggedIn = function(){
        return _loggedIn;
    };

}


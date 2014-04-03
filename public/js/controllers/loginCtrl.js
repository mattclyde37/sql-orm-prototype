angular.module('sql-prototype')
.controller('LoginCtrl', function ($scope, $state, UserSession){

        $scope.info = {
            username: '',
            pass: ''
        }

        $scope.attemptLogin = function (info){
            UserSession.login(info.username, info.pass, function (success, msg){
                if (success){
                    $state.go(UserSession.desiredState);
                } else{
                    alert('Login Failed: ' + msg);
                }

            });
        }

        $scope.logout = function (){
            UserSession.logout();
        }



    });
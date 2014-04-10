angular.module('sql-prototype')
.controller('HomeCtrl', function ($scope, $state, UserSession){

        $scope.logout = function (){
            UserSession.logout();
            $state.go('login');
        }

    });
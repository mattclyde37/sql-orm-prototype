angular.module('sql-prototype')
    .controller('WelcomeCtrl', function ($scope, $state, $http){

        $scope.signIn = function (){
            $state.go('login');
        };

    });
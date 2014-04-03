angular.module('sql-prototype')
    .controller('WelcomeCtrl', function ($scope, $state, $http){


        $scope.signIn = function (){
            $state.go('login');
        }

        $scope.test = function (){
            $http.get('/forbidden');
        }


    });
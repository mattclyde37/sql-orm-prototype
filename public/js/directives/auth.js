angular.module('sql-prototype')
    .directive('auth', function (){
        return {
            restrict: 'A',
            link: function (scope, elem, attr){
                alert('Check authentication!');
            }
        }
    });
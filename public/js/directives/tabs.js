angular.module('sql-prototype')
    .directive('myTabs', function (){
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            template: '<div ng-transclude></div>',
            link: function (scope, elem, attrs){
                debugger;
            }
        }
    })
    .directive('myTab', function (){
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                title: '@'
            },
            template: '<div>' +
                        '<div class="btn btn-default">{{title}}</div>' +
                        '<div ng-transclude></div>' +
                      '</div>',
            link: function (scope, elem, attrs){

            }
        }
    });


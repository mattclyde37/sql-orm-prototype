angular.module('sql-prototype')
    .directive('sessionButton', function (){
        return {
            restrict: 'E',
            scope: {},
            template: '<div class="btn btn-default float-right sessionButton" ng-click="sessionAction()">{{title}}</div>',
            controller: function ($scope, $state, UserSession){



                $scope.title = UserSession.isLoggedIn() ? "Sign Out" : "Sign In";
                $scope.sessionAction = function(){
                    if (UserSession.isLoggedIn())
                        UserSession.logout();
                    else
                        $state.go('login');
                }
            }
        }
    });
angular.module('sql-prototype', ['ui.router'])
    .factory('_', function (){
        return window._;
    })
    .run(function ($rootScope, $location, $state, UserSession, _) {

        // enumerate routes that don't need authentication
        var cleanStates = ['login', 'welcome'];

        var isCleanState = function (state){
            return (cleanStates.indexOf(state) !== -1);
        };

        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

            if (!isCleanState(to.name) && !UserSession.isLoggedIn()){
                debugger;
                UserSession.desiredState = to.name;
                ev.preventDefault();
                $state.go('login');
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider){
        $urlRouterProvider.otherwise('/welcome');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'views/welcome.html',
                controller: 'WelcomeCtrl'
            })
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'views/users.html',
                controller: 'UsersCtrl'
            })
            .state('forbidden', {
                url: '/forbidden',
                templateUrl: 'views/forbidden.html'
            });

        $httpProvider.responseInterceptors.push(handle400Responses);
    });



function handle400Responses ($q, $location) {
    var success = function (response) {
        return response;
    };

    var error = function (response) {
        if (response.status === 401) {
            debugger;
            //redirect them back to login page
            $location.path('/login');
            return $q.reject(response);
        }
        else if (response.status === 403){
            //redirect them back to permissions denied page
            debugger;
            $location.path('/forbidden');
            return $q.reject(response);
        }
        else {
            return $q.reject(response);
        }
    };

    return function (promise) {
        return promise.then(success, error);
    };
};

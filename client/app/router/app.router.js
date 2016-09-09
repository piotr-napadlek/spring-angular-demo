(function () {
    'use strict';

    /**
     * Router module describing all redirections.
     */
    angular.module('app.router', [
        'ngRoute'
    ])

        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {redirectTo: '/home'})
                .when('/home', {templateUrl: 'assets/home/home.html'})
                .when('/things', {templateUrl: 'things/list.html'})
                .otherwise({templateUrl: 'assets/page-not-found/page-not-found.html'});
        });
})();

(function () {
    'use strict';

    /**
     * Router module describing all redirections.
     */
    angular.module('app.router', [
        'ngRoute'
    ])

    /**
     * Shows us the right way.
     */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {redirectTo: '/home'})
                .when('/home', {templateUrl: 'assets/home/home.html'})
                .when('/tree', {templateUrl: 'tree/treePanel.html'})
                .otherwise({templateUrl: 'assets/page-not-found/page-not-found.html'});
        });
})();

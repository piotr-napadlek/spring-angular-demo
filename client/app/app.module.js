(function () {
    'use strict';

    /**
     * Main app module with all its dependencies defined.
     */
    angular.module('app', [
        'ngRoute',
        'app.router',
        'app.things',
        'app.common'
    ])

        .config(function ($locationProvider) {
            $locationProvider.html5Mode(false);
        });
})();

(function () {
    'use strict';

    angular.module('app.common').factory('restService', function ($http, currentContextPath) {

        var currentContext = currentContextPath.get() + 'rest/';

        return {
            read: function (path, params) {
                return $http.get(currentContext + path, {
                    timeout: 10000,
                    params: params
                });
            }
        };
    });
})();


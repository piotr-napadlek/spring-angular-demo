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
            },
            update: function (path, body, params) {
                return $http.put(currentContext + path, body, {
                    timeout: 10000,
                    params: params
                });
            },
            delete: function (path, params) {
                return $http.delete(currentContext + path, {
                    timeout: 10000,
                    params: params
                });
            }
        };
    });
})();


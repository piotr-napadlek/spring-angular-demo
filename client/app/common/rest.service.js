(function () {
    'use strict';

    angular.module('app.common')

    /**
     * REST CRUD functionality for a given context, in this case <contextPath>/rest/
     */
        .factory('restService', function ($http, currentContextPath) {

            var currentContext = currentContextPath.get() + 'rest/';

            return {

                /**
                 * Reads the data with GET http method.
                 * @param path path which should be read.
                 * @param params request params which will be appended.
                 * @returns {HttpPromise}
                 */
                read: function (path, params) {
                    return $http.get(currentContext + path, {
                        timeout: 10000,
                        params: params
                    });
                },

                /**
                 * Updates the data with PUT http method.
                 * @param path path at which we wish to send the request.
                 * @param body Body which will be translated to JSON and sent as request body.
                 * @param params additional request params.
                 * @returns {HttpPromise}
                 */
                update: function (path, body, params) {
                    return $http.put(currentContext + path, body, {
                        timeout: 10000,
                        params: params
                    });
                },
                
                /**
                 * Calls DELETE http method at given path.
                 * @param path path to call.
                 * @param params additional request params.
                 * @returns {HttpPromise}
                 */
                delete: function (path, params) {
                    return $http.delete(currentContext + path, {
                        timeout: 10000,
                        params: params
                    });
                }
            };
        });
})();


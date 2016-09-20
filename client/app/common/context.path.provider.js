(function () {
    'use strict';

    angular.module('app.common')

    /**
     * Provides the info about current context path, which is the root for all REST requests. Usually '/' when running on localhost.
     */
        .factory('currentContextPath', function ($window) {

            var contextPath = '';

            return {

                /**
                 * Returns current context path.
                 * @returns {string}
                 */
                get: function () {
                    var contextPathNotInitializedYet = contextPath ? false : true;
                    var path;
                    var splitPath;
                    var parsedContextPath;

                    if (contextPathNotInitializedYet) {
                        contextPath = '/';
                        path = $window.location.pathname;
                        if (path && path !== contextPath) {
                            splitPath = path.split('/');
                            if (splitPath.length > 1) {
                                parsedContextPath = splitPath[1];
                                if (parsedContextPath) {
                                    contextPath += parsedContextPath + '/';
                                }
                            }
                        }
                    }
                    return contextPath;
                }
            };
        });
})();
    

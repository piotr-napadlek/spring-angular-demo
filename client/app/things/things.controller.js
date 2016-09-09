(function () {
    'use strict';

    angular.module('app.things')

        .controller('ThingsListController', function (restService, $scope) {

            $scope.things = [];

            $scope.search = function () {
                restService.read('thing').then(pasteData);
            };

            function pasteData(response) {
                angular.copy(response.data, $scope.things);
            }
        });
})();


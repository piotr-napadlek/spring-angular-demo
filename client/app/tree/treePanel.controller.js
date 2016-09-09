(function () {
    'use strict';

    angular.module('app.tree')

        .controller('TreePanelController', function (restService, $scope) {

            $scope.list = [];

            $scope.search = function () {
                restService.read('thing').then(pasteData);
            };

            function pasteData(response) {
                angular.copy(response.data, $scope.list);
                $scope.list[0].items = [{
                    id: 2,
                    name: 'sub'
                }]
            }
        });
})();


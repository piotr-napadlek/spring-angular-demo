(function () {
    'use strict';

    describe('Tree controller test', function () {
        var $scope;
        var restService;

        beforeEach(function () {
            module('app.tree')
        });

        beforeEach(inject(function ($rootScope, $injector, $controller, $q) {
            $scope = $rootScope.$new();
            restService = $injector.get('restService');

            spyOn(restService, 'read').and.returnValue($q(function (resolve) {
                resolve({
                    data: [{
                        id: 2,
                        value: 8,
                        rootSum: 8,
                        parentId: null,
                        persisted: true
                    }]
                });
            }));

            $controller('TreePanelController', {
                $scope: $scope
            });
            $scope.$digest();
        }));


        it('checks if some basic functions are defined', inject(function () {
            expect($scope.saveNode).toBeDefined();
            expect($scope.toggleNode).toBeDefined();
            expect($scope.deleteNode).toBeDefined();
        }));


        it('checks if toggle node calls rest when expanding for the first time', inject(function ($q) {
            // given
            var nodeScope = {
                node: $scope.nodesStructure[0],
                toggle: function () {
                },
                collapsed: true
            };
            spyOn(nodeScope, 'toggle');
            // when
            $scope.toggleNode(nodeScope);
            $scope.$digest();
            // then
            expect(restService.read).toHaveBeenCalledWith('nodes/2', {parentRootSum: 8});
            expect($scope.nodesStructure[0].subNodes.length).toBe(1);
            expect(nodeScope.toggle).toHaveBeenCalled();
            expect(nodeScope.node.childrenLoaded).toBeTruthy();
            expect(nodeScope.node.subNodes[0].persisted).toBeTruthy();
        }));

        //TODO PiNa write tests for all $scope methods to ensure its functionality
    })
})();

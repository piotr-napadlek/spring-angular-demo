(function () {
    'use strict';

    angular.module('app.tree')

        .controller('TreePanelController', function (restService, $scope) {

            $scope.nodesStructure = [];

            $scope.setEditMode = function (editMode, scope) {
                var editedNode = scope.node;
                if (editMode) {
                    if (editedNode.persisted) {}
                    editedNode.lastValue = editedNode.value;
                } else {
                    if (!editedNode.persisted) {
                        scope.remove();
                    } else {
                        editedNode.value = editedNode.lastValue;
                    }
                }
                editedNode.editMode = editMode;
            };

            $scope.deleteNode = function (scope) {
                restService.delete('nodes/' + scope.node.id).then(function (response) {
                    if (response.status === 200) {
                        scope.remove();
                    }
                });
            };

            $scope.saveNode = function (scope) {
                var childrenLoaded = scope.node.childrenLoaded;
                scope.node.value = parseFloat(scope.node.value);
                restService.update('nodes', scope.node).then(function (response) {
                    angular.copy(response.data, scope.node);
                    scope.node.childrenLoaded = childrenLoaded;
                });
            };

            $scope.toggleNode = function (scope) {
                if (scope.collapsed && !scope.node.childrenLoaded) {
                    restService.read('nodes/' + scope.node.id).then(function (response) {
                        if (!scope.node.subNodes) {
                            scope.node.subNodes = [];
                        }
                        var loadedNodes = [];
                        angular.copy(response.data, loadedNodes);
                        angular.forEach(loadedNodes, function (node) {
                            node.persisted = true;
                            scope.node.subNodes.push(node);
                        });
                        scope.node.childrenLoaded = true;
                    });
                }
                scope.toggle();
            };

            $scope.newSubItem = function (scope) {
                var nodeData = scope.node;
                if (!nodeData.subNodes) {
                    nodeData.subNodes = [];
                }
                if (scope.collapsed) {
                    $scope.toggleNode(scope);
                }
                nodeData.subNodes.push({
                    id: null,
                    value: 0,
                    lastValue: 0,
                    subNodes: [],
                    editMode: true,
                    parentId: nodeData.id
                });
            };

            var load = function () {
                restService.read('nodes').then(pasteData);
            };

            var pasteData = function (response) {
                angular.copy(response.data, $scope.nodesStructure);
            };

            load();
        });
})();


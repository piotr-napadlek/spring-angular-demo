(function () {
    'use strict';

    angular.module('app.tree')

        .controller('TreePanelController', function (restService, $scope) {

            $scope.nodesStructure = [];
            $scope.globalEditMode = false;

            $scope.setEditMode = function (editMode, scope) {
                $scope.globalEditMode = editMode;
                var editedNode = scope.node;
                if (!editMode) {
                    if (!editedNode.persisted) {
                        scope.remove();
                    } else {
                        editedNode.value = editedNode.lastValue;
                    }
                } else {
                    editedNode.lastValue = editedNode.value;
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
                scope.node.value = parseFloat(scope.node.value);
                var parentRootSum = scope.$parentNodeScope ? scope.$parentNodeScope.node.rootSum : 0;
                restService.update('nodes', scope.node, {parentRootSum: parentRootSum}).then(function (response) {
                    scope.node.rootSum = response.data.rootSum;
                    scope.node.id = response.data.id;
                    scope.node.value = response.data.value;
                    propagateChildren(scope.node.subNodes, response.data.subNodes);
                    scope.node.editMode = false;
                    $scope.globalEditMode = false;
                });
            };

            $scope.toggleNode = function (scope) {
                if (scope.collapsed && !scope.node.childrenLoaded) {
                    restService.read('nodes/' + scope.node.id, {parentRootSum: scope.node.rootSum}).then(function (response) {
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
                $scope.globalEditMode = true;
            };

            $scope.addNewRoot = function () {
                $scope.nodesStructure.push({
                    id: null,
                    value: 0,
                    lastValue: 0,
                    subNodes: [],
                    editMode: true,
                    parentId: null
                });
                $scope.globalEditMode = true;
            };

            var load = function () {
                restService.read('nodes').then(pasteData);
            };

            var pasteData = function (response) {
                angular.copy(response.data, $scope.nodesStructure);
            };

            var findNodeById = function (id, sourceNodes) {
                var childFound = null;
                angular.forEach(sourceNodes, function (child) {
                    if (child.id === id) {
                        childFound = child;
                        return;
                    }
                });
                return childFound;
            };

            var propagateChildren = function (children, sourceChildren) {
                if (children) {
                    angular.forEach(children, function (child) {
                        var foundNode = findNodeById(child.id, sourceChildren);
                        child.rootSum = foundNode.rootSum;
                        propagateChildren(child.subNodes, foundNode.subNodes);
                    });
                }
            };

            load();
        });
})();


(function () {
    'use strict';

    angular.module('app.tree')

        .controller('TreePanelController', function (restService, $scope, $q) {

            $scope.nodesStructure = [];
            $scope.globalEditMode = false;
            $scope.autoSave = true;
            $scope.requestsList = [];

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
                scope.node.markedToRemove = true;
                scope.node.dirty = true;
                function markChildrenToRemove(children) {
                    children.forEach(function (child) {
                        child.markedToRemove = true;
                        child.dirty = true;
                        markChildrenToRemove(child.subNodes);
                    });
                }
                markChildrenToRemove(scope.node.subNodes);
                var deleteFunction = function() {
                    return restService.delete('nodes/' + scope.node.id).then(function (response) {
                        if (response.status === 200) {
                            scope.remove();
                        }
                    });
                };
                $scope.requestsList.push(deleteFunction);
                if ($scope.autoSave) {
                    $scope.saveAll();
                }
            };

            $scope.saveNode = function (scope) {
                scope.node.value = parseFloat(scope.node.value);
                scope.node.dirty = true;
                var saveFunction = function() {
                    var parentRootSum = scope.$parentNodeScope ? scope.$parentNodeScope.node.rootSum : 0;
                    return restService.update('nodes', scope.node, {parentRootSum: parentRootSum}).then(function (response) {
                        scope.node.rootSum = response.data.rootSum;
                        scope.node.id = response.data.id;
                        scope.node.value = response.data.value;
                        scope.node.persisted = true;
                        scope.node.dirty = false;
                        propagateChildren(scope.node.subNodes, response.data.subNodes, scope.node);
                    });
                };
                scope.node.editMode = false;
                $scope.globalEditMode = false;
                $scope.requestsList.push(saveFunction.bind(this));
                if ($scope.autoSave) {
                    $scope.saveAll();
                }
            };

            $scope.saveAll = function () {
                serial($scope.requestsList);
                $scope.requestsList = [];
            };

            $scope.autoSaveChanged = function () {
                if ($scope.autoSave) {
                    $scope.saveAll();
                }
            };

            function serial(tasks) {
                var prevPromise;
                angular.forEach(tasks, function (task) {
                    //First task
                    if (!prevPromise) {
                        prevPromise = task();
                    } else {
                        prevPromise = prevPromise.then(task);
                    }
                });
                return prevPromise;
            }

            $scope.toggleNode = function (scope) {
                if (scope.collapsed && !scope.node.childrenLoaded && scope.node.persisted) {
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
                if ($scope.globalEditMode) {
                    return;
                }
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

            var propagateChildren = function (children, sourceChildren, parent) {
                if (children) {
                    angular.forEach(children, function (child) {
                        var foundNode = findNodeById(child.id, sourceChildren);
                        child.rootSum = foundNode.rootSum;
                        child.parentId = parent.id;
                        propagateChildren(child.subNodes, foundNode.subNodes, child);
                    });
                }
            };

            load();
        });
})();


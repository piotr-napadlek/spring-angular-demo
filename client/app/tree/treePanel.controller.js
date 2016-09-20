(function () {
    'use strict';

    angular.module('app.tree')

    /**
     * Root controller for tree structure view. Manages tree view as well as buttons and checkbox.
     * Requires restService to perform REST calls.
     */
        .controller('TreePanelController', function (restService, $scope) {

            /**
             * Root container for tree nodes.
             */
            $scope.nodesStructure = [];
            /**
             * Defines if all other nodes edit options should be disabled during editing of one.
             * @type {boolean}
             */
            $scope.globalEditMode = false;
            /**
             * Defines if elements should be auto persisted after editing. Corresponds to "Enable autosave" checkbox value.
             * @type {boolean}
             */
            $scope.autoSave = true;
            /**
             * Array of promise returning functions which will be called sequentially when user clicks "Save all"
             * @type {Array}
             */
            $scope.requestsList = [];

            /**
             * Handles events that occur during or after dragging a node.
             * @type {{dropped: $scope.treeEvents.dropped, accept: $scope.treeEvents.accept}}
             */
            $scope.treeEvents = {
                /**
                 * Handles the aftermath of user dragging an element. If the parent node got changed, it is marked to be saved.
                 * @param event
                 */
                dropped: function (event) {
                    var sourceScope = event.source.nodeScope;
                    var destinationScope = event.dest.nodesScope.$nodeScope;
                    if (destinationScope === null) {
                        if (sourceScope.node.parentId !== null) {
                            $scope.saveNode(sourceScope, {id: null, rootSum: 0});
                        }
                    } else {
                        if (sourceScope.node.parentId !== destinationScope.$modelValue.id) {
                            $scope.saveNode(sourceScope, destinationScope.$modelValue);
                        }
                    }
                },

                /**
                 * Disallows dragging a node under a node which is marked to save (dirty property).
                 * @param sourceNodeScope
                 * @param destNodesScope
                 * @returns {boolean}
                 */
                accept: function (sourceNodeScope, destNodesScope) {
                    if (destNodesScope.$nodeScope) {
                        return !destNodesScope.$nodeScope.$modelValue.dirty;
                    } else {
                        return true;
                    }
                }
            };

            /**
             * Sets given scope node to edit mode.
             * @param {boolean} editMode flag for edit mode.
             * @param scope scope for which these will be applied.
             */
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

            /**
             * Handles deleting a node. Will cause all children nodes to be removed as well.
             * @param scope
             */
            $scope.deleteNode = function (scope) {
                scope.node.markedToRemove = true;
                scope.node.dirty = true;
                function markChildrenToRemove(children) {
                    if (children) {
                        children.forEach(function (child) {
                            child.markedToRemove = true;
                            child.dirty = true;
                            markChildrenToRemove(child.subNodes);
                        });
                    }
                }

                markChildrenToRemove(scope.node.subNodes);
                var deleteFunction = function () {
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

            /**
             * Saves edited node
             * @param scope ui-node which model will be persisted.
             * @param parent optional - parent of a node after dragged.
             */
            $scope.saveNode = function (scope, parent) {
                scope.node.value = parseFloat(scope.node.value);
                scope.node.dirty = true;
                var saveFunction = function () {
                    var parentRootSum = scope.$parentNodeScope ? scope.$parentNodeScope.node.rootSum : 0;
                    if (parent) {
                        parentRootSum = parent.rootSum;
                        scope.node.parentId = parent.id;
                    }
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

            /**
             * Calls all REST requests in a sequence.
             */
            $scope.saveAll = function () {
                runPromiseSequence($scope.requestsList);
                $scope.requestsList = [];
            };

            /**
             * Handles changes to autosave checkbox. Calls saveAll() if autosave got enabled.
             */
            $scope.autoSaveChanged = function () {
                if ($scope.autoSave) {
                    $scope.saveAll();
                }
            };

            /**
             * Handles user toggling a node. The elements in the tree are lazy loaded - they are read from REST service upon expanding a node.
             * @param scope ui-nodes scope.
             */
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

            /**
             * Handles adding an item. Simply appends unpersisted node to given scope. Auto-expands collapsed node.
             * @param scope ui-node to which new subNode will be appended.
             */
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
                    parentId: nodeData.id,
                    childrenLoaded: true
                });
                $scope.globalEditMode = true;
            };

            /**
             * Handles user adding new root node with "Add new root node" button.
             */
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
                    parentId: null,
                    childrenLoaded: true
                });
                $scope.globalEditMode = true;
            };

            /**
             * Initializes the base data. It is called at the bottom of the controller upon initialization.
             */
            var load = function () {
                restService.read('nodes').then(pasteData);
            };

            /**
             * Paste response data.
             * @param response REST call response.
             */
            var pasteData = function (response) {
                angular.copy(response.data, $scope.nodesStructure);
                angular.forEach($scope.nodesStructure, function (rootNode) {
                    rootNode.persisted = true;
                });
            };

            /**
             * Finds node by its ID in the given list of nodes.
             * @param id id of a sought node.
             * @param sourceNodes Array of nodes to be searched.
             * @returns {*}
             */
            var findNodeById = function (id, sourceNodes) {
                var childFound = null;
                angular.forEach(sourceNodes, function (child) {
                    if (child.id === id) {
                        childFound = child;
                    }
                });
                return childFound;
            };

            /**
             * Applies rootSums after saving a parent node to all children recursively.
             * @param children
             * @param sourceChildren
             * @param parent
             */
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

            /**
             * Utility functions that calls all functions in a promise sequence, that is, it waits for a previous promise to resolve before
             * running another. Important to avoid data corruption. We assume valid tree state after each of these operations.
             * @param tasks Array of promise returning functions.
             * @returns {*}
             */
            var runPromiseSequence = function (tasks) {
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
            };

            // initialize the root nodes data
            load();
        });
})();


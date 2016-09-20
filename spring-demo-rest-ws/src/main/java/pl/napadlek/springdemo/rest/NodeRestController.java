package pl.napadlek.springdemo.rest;

import org.springframework.web.bind.annotation.*;
import pl.napadlek.springdemo.dto.NodeDO;
import pl.napadlek.springdemo.service.NodeService;

import javax.inject.Inject;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/nodes")
public class NodeRestController {

    @Inject
    private NodeService nodeService;

    /**
     * Returns all the root nodes - the ones without parent node.
     * @return List of {@link NodeDO} whose parent ID is null.
     */
    @RequestMapping(method = RequestMethod.GET)
    public List<NodeDO> findRootNodes() {
        return nodeService.findRootNodes();
    }

    /**
     * Find children nodes of given node id.
     * @param id id of a node whose children will be sought.
     * @param parentRootSum parent root sum as taken from parent node. Needed to calculate root sums of the children
     * @return List of {@link NodeDO} with matching parent ID and their root sums calculated on a basis of parent root sum.
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public List<NodeDO> findChildrenNodes(@PathVariable("id") long id, @RequestParam(value = "parentRootSum") double parentRootSum) {
        List<NodeDO> children = nodeService.findChildrenOf(id);
        nodeService.calculateChildrenRootSum(parentRootSum, children);
        return children;
    }

    /**
     * Persists the given node.
     * @param nodeDO NodeDO object filled with the data. If its ID is null, new Database row will be created.
     * @param parentRootSum parent root sum taken from parent node, required to calculate children root sums if the value gets changed.
     * @return
     */
    @RequestMapping(method = {RequestMethod.PUT, RequestMethod.POST})
    public NodeDO updateNode(@RequestBody NodeDO nodeDO, @RequestParam(value = "parentRootSum") double parentRootSum) {
        NodeDO savedNode = nodeService.saveNode(nodeDO);
        nodeService.calculateChildrenRootSum(parentRootSum, Arrays.asList(savedNode));
        return savedNode;
    }

    /**
     * Deletes a node with a given ID
     * @param id ID of a node to be deleted.
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void removeNode(@PathVariable("id") long id) {
        nodeService.removeNode(id);
    }
}

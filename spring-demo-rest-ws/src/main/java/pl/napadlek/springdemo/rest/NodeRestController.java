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

    @RequestMapping(method = RequestMethod.GET)
    public List<NodeDO> findRootNodes() {
        return nodeService.findRootNodes();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public List<NodeDO> findChildrenNodes(@PathVariable("id") long id, @RequestParam(value = "parentRootSum") double parentRootSum) {
        List<NodeDO> children = nodeService.findChildrenOf(id);
        nodeService.calculateChildrenRootSum(parentRootSum, children);
        return children;
    }

    @RequestMapping(method = {RequestMethod.PUT, RequestMethod.POST})
    public NodeDO updateNode(@RequestBody NodeDO nodeDO, @RequestParam(value = "parentRootSum") double parentRootSum) {
        NodeDO savedNode = nodeService.saveNode(nodeDO);
        nodeService.calculateChildrenRootSum(parentRootSum, Arrays.asList(savedNode));
        return savedNode;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void removeNode(@PathVariable("id") long id) {
        nodeService.removeNode(id);
    }
}

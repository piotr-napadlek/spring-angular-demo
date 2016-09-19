package pl.napadlek.springdemo.rest;

import org.springframework.web.bind.annotation.*;
import pl.napadlek.springdemo.dto.NodeDO;
import pl.napadlek.springdemo.entity.NodeBE;
import pl.napadlek.springdemo.service.NodeService;

import javax.inject.Inject;
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
    public List<NodeDO> findChildrenNodes(@PathVariable("id") long id) {
        return nodeService.findChildrenOf(id);
    }

    @RequestMapping(method = {RequestMethod.PUT, RequestMethod.POST})
    public NodeDO updateNode(@RequestBody NodeDO nodeDO) {
        return nodeService.saveNode(nodeDO);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void removeNode(@PathVariable("id") long id) {
        nodeService.removeNode(id);
    }
}

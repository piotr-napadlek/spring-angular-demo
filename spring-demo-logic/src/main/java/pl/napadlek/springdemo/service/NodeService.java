package pl.napadlek.springdemo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.napadlek.springdemo.dto.NodeDO;
import pl.napadlek.springdemo.entity.NodeBE;
import pl.napadlek.springdemo.repository.NodeRepository;

import javax.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class NodeService {

    @Inject
    private NodeRepository nodeRepository;


    public List<NodeDO> findRootNodes() {
        return nodeRepository.findRootNodes().stream()
                .map(NodeDO::new)
                .peek(node -> node.setRootSum(node.getValue()))
                .collect(Collectors.toList());
    }

    public List<NodeDO> findChildrenOf(long parentNodeId) {
        return nodeRepository.findChildren(parentNodeId).stream().map(NodeDO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = false)
    public NodeDO saveNode(NodeDO nodeDO) {
        NodeBE nodeToSave;
        if (nodeDO.getId() == null) {
            nodeToSave = new NodeBE();
        } else {
            nodeToSave = nodeRepository.getOne(nodeDO.getId());
        }
        applyNodeDODataToEntity(nodeDO, nodeToSave);
        NodeDO savedNodeDO = new NodeDO(nodeRepository.save(nodeToSave));
        savedNodeDO.setSubNodes(nodeDO.getSubNodes());
        return savedNodeDO;
    }

    @Transactional(readOnly = false)
    public void removeNode(long nodeId) {
        findChildrenOf(nodeId).forEach(child -> removeNode(child.getId()));
        nodeRepository.delete(nodeId);
    }

    public void calculateChildrenRootSum(double parentRootSum, List<NodeDO> children) {
        if (children != null) {
            children.forEach(child -> {
                child.setRootSum(parentRootSum + child.getValue());
                calculateChildrenRootSum(child.getRootSum(), child.getSubNodes());
            });
        }
    }

    private void applyNodeDODataToEntity(NodeDO nodeDO, NodeBE nodeToSave) {
        nodeToSave.setValue(nodeDO.getValue());
        if (nodeDO.getParentId() != null) {
            nodeToSave.setParentNode(nodeRepository.getOne(nodeDO.getParentId()));
        }
    }

}

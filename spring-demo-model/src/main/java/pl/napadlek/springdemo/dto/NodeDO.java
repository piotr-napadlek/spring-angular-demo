package pl.napadlek.springdemo.dto;

import pl.napadlek.springdemo.entity.NodeBE;

import java.util.List;
import java.util.Optional;

/**
 * Object corresponding to GUI data model.
 */
public class NodeDO {

    private Long id;
    private double value;
    private Long parentId;
    private double rootSum;
    private List<NodeDO> subNodes;

    public NodeDO() {
    }

    public NodeDO(NodeBE nodeBE) {
        this.id = nodeBE.getId();
        this.value = nodeBE.getValue();
        this.parentId = Optional.ofNullable(nodeBE.getParentNode()).map(NodeBE::getId).orElse(null);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public List<NodeDO> getSubNodes() {
        return subNodes;
    }

    public void setSubNodes(List<NodeDO> subNodes) {
        this.subNodes = subNodes;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public double getRootSum() {
        return rootSum;
    }

    public void setRootSum(double rootSum) {
        this.rootSum = rootSum;
    }
}

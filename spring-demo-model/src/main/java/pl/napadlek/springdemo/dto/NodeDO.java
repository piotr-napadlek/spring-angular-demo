package pl.napadlek.springdemo.dto;

import pl.napadlek.springdemo.entity.NodeBE;

import java.util.List;
import java.util.Optional;

public class NodeDO {

    private Long id;
    private double value;
    private double lastValue;
    private Long parentId;
    private double rootSum;
    private List<NodeDO> subNodes;
    private boolean persisted;
    private boolean childrenLoaded;
    private boolean editMode;

    public NodeDO() {
    }

    public NodeDO(NodeBE nodeBE) {
        this.id = nodeBE.getId();
        this.value = nodeBE.getValue();
        this.parentId = Optional.ofNullable(nodeBE.getParentNode()).map(NodeBE::getId).orElse(null);
        this.persisted = true;
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

    public boolean isPersisted() {
        return persisted;
    }

    public void setPersisted(boolean persisted) {
        this.persisted = persisted;
    }

    public boolean isChildrenLoaded() {
        return childrenLoaded;
    }

    public void setChildrenLoaded(boolean childrenLoaded) {
        this.childrenLoaded = childrenLoaded;
    }

    public boolean isEditMode() {
        return editMode;
    }

    public void setEditMode(boolean editMode) {
        this.editMode = editMode;
    }

    public double getLastValue() {
        return lastValue;
    }

    public void setLastValue(double lastValue) {
        this.lastValue = lastValue;
    }
}

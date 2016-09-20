package pl.napadlek.springdemo.entity;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Node Business Entity.
 */
@Entity
@Table(name = "T_NODE")
public class NodeBE implements Serializable{

    @SequenceGenerator(name = "SQ_NODE", initialValue = 100, allocationSize = 1)
    @Id
    @GeneratedValue(generator = "SQ_NODE")
    private Long id;

    @Column(nullable = false)
    private double value;

    @ManyToOne
    private NodeBE parentNode;


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

    public NodeBE getParentNode() {
        return parentNode;
    }

    public void setParentNode(NodeBE parentNode) {
        this.parentNode = parentNode;
    }
}

package pl.templates.spring.entity;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "T_THING")
public class ThingBE {

    @SequenceGenerator(name = "SQ_THING", initialValue = 100, allocationSize = 1)
    @Id
    @GeneratedValue(generator = "SQ_THING")
    private long id;

    @Column(name = "name", length = 100)
    private String name;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

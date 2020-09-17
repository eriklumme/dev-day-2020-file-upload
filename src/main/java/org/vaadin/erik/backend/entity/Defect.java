package org.vaadin.erik.backend.entity;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.util.UUID;

@Entity
public class Defect extends AbstractEntity {

    private String description;

    private String uuid;

    @OneToOne(mappedBy = "defect")
    private Image image;

    protected Defect() {}

    public Defect(String description) {
        this.description = description;
        this.uuid = UUID.randomUUID().toString();
    }

    public String getDescription() {
        return description;
    }

    public String getUuid() {
        return uuid;
    }

    public Image getImage() {
        return image;
    }
}

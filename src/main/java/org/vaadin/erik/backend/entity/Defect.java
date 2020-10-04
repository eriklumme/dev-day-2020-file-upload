package org.vaadin.erik.backend.entity;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class Defect extends AbstractEntity {

    private String description;

    @OneToOne(mappedBy = "defect")
    private Image image;

    protected Defect() {}

    public Defect(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public Image getImage() {
        return image;
    }
}

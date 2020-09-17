package org.vaadin.erik.backend.entity;

import javax.persistence.*;

@Entity
public class Image {

    @Id
    private Long id;

    @Lob
    private byte[] data;

    private String filename;

    @OneToOne
    @MapsId
    private Defect defect;

    public Image() {}

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Defect getDefect() {
        return defect;
    }

    public void setDefect(Defect defect) {
        this.defect = defect;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}

package org.vaadin.erik.ui;

import com.vaadin.flow.component.AttachEvent;
import com.vaadin.flow.component.Text;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.StreamResource;
import org.vaadin.erik.backend.entity.Defect;
import org.vaadin.erik.backend.service.DefectService;

import java.io.ByteArrayInputStream;

@Route("defects")
public class DefectListView extends HorizontalLayout {

    private final DefectService defectService;

    public DefectListView(DefectService defectService) {
        this.defectService = defectService;
    }

    private void init() {
        addClassName("defect-reports");
        setSpacing(false);
        defectService.getAllDefects().forEach(this::createDefectCard);
    }

    private void createDefectCard(Defect defect) {
        VerticalLayout defectCard = new VerticalLayout();
        defectCard.addClassName("defect-card");
        if (defect.getImage() != null) {
            defectCard.add(createImage(defect));
        }
        defectCard.add(new Text(defect.getDescription()));
        add(defectCard);
    }

    private Image createImage(Defect defect) {
        byte[] data = defect.getImage().getData();
        String filename = defect.getImage().getFilename();
        StreamResource streamResource = new StreamResource(filename, () -> new ByteArrayInputStream(data));
        Image image = new Image(streamResource, filename);
        image.addClassName("defect-image");
        return image;
    }

    @Override
    protected void onAttach(AttachEvent attachEvent) {
        if (attachEvent.isInitialAttach()) {
            init();
        }
    }
}

package org.vaadin.erik.ui;

import com.vaadin.flow.component.AttachEvent;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Text;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.StreamResource;
import org.vaadin.erik.backend.entity.Defect;
import org.vaadin.erik.backend.service.DefectService;

import java.io.ByteArrayInputStream;

@Route("defects")
public class DefectListView extends Div {

    private final DefectService defectService;

    public DefectListView(DefectService defectService) {
        this.defectService = defectService;
    }

    private void init() {
        addClassName("defect-reports");
        defectService.getAllDefects().forEach(this::createDefectCard);
    }

    private void createDefectCard(Defect defect) {
        Div defectCard = new Div();
        defectCard.addClassName("defect-card");
        defectCard.add(createImage(defect));
        Div textDiv = new Div(new Text(defect.getDescription()));
        textDiv.addClassName("defect-text");
        defectCard.add(textDiv);
        add(defectCard);
    }

    private Component createImage(Defect defect) {
        Component image;
        if (defect.getImage() != null) {
            byte[] data = defect.getImage().getData();
            String filename = defect.getImage().getFilename();
            StreamResource streamResource = new StreamResource(filename, () -> new ByteArrayInputStream(data));
            image = new Image(streamResource, filename);
        } else {
            image = new VerticalLayout(VaadinIcon.FILE_PICTURE.create(), new Text("No image"));
            image.getElement().getStyle().set("align-items", "center");
        }
        Div wrapper = new Div(image);
        wrapper.addClassName("defect-image");
        return wrapper;
    }

    @Override
    protected void onAttach(AttachEvent attachEvent) {
        if (attachEvent.isInitialAttach()) {
            init();
        }
    }
}

package org.vaadin.erik.backend.endpoint;

import com.vaadin.flow.server.connect.Endpoint;
import com.vaadin.flow.server.connect.auth.AnonymousAllowed;
import org.vaadin.erik.backend.entity.Defect;
import org.vaadin.erik.backend.service.DefectService;

@Endpoint
@AnonymousAllowed
public class ReportDefectEndpoint {

    private final DefectService defectService;

    public ReportDefectEndpoint(DefectService defectService) {
        this.defectService = defectService;
    }

    public String postDefect(String description) {
        Defect defect = defectService.createDefect(description);
        return defect.getUuid();
    }
}

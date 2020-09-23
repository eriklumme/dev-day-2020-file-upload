package org.vaadin.erik.backend.endpoint;

import com.vaadin.flow.server.connect.Endpoint;
import com.vaadin.flow.server.connect.auth.AnonymousAllowed;
import org.vaadin.erik.backend.entity.Defect;
import org.vaadin.erik.backend.service.DefectService;

import javax.validation.constraints.NotBlank;

@Endpoint
@AnonymousAllowed
public class ReportDefectEndpoint {

    private final DefectService defectService;

    public ReportDefectEndpoint(DefectService defectService) {
        this.defectService = defectService;
    }

    public String postDefect(@NotBlank String description, Object fileId) {
        Defect defect = defectService.createDefect(description);
        return defect.getUuid();
    }
}

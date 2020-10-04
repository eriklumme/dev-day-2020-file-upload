package org.vaadin.erik.backend.endpoint;

import com.vaadin.flow.server.connect.Endpoint;
import org.vaadin.erik.backend.entity.Defect;
import org.vaadin.erik.backend.service.DefectService;

import javax.annotation.security.RolesAllowed;
import javax.validation.constraints.NotBlank;

@Endpoint
@RolesAllowed("USER")
public class ReportDefectEndpoint {

    private final DefectService defectService;

    public ReportDefectEndpoint(DefectService defectService) {
        this.defectService = defectService;
    }

    public Long postDefect(@NotBlank String description) {
        Defect defect = defectService.createDefect(description);
        return defect.getId();
    }
}

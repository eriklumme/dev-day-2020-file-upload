package org.vaadin.erik.backend.service;

import org.springframework.stereotype.Service;
import org.vaadin.erik.backend.entity.Defect;
import org.vaadin.erik.backend.repository.DefectRepository;

@Service
public class DefectService {

    private final DefectRepository repository;

    public DefectService(DefectRepository repository) {
        this.repository = repository;
    }

    public Defect createDefect(String description) {
        Defect defect = new Defect(description);
        return repository.save(defect);
    }

    public Iterable<Defect> getAllDefects() {
        return repository.findAll();
    }
}

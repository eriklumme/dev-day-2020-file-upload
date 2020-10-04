package org.vaadin.erik.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.vaadin.erik.backend.entity.Defect;

@Repository
public interface DefectRepository extends CrudRepository<Defect, Long> {
}

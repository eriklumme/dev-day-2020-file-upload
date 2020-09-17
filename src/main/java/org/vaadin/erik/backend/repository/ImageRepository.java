package org.vaadin.erik.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.vaadin.erik.backend.entity.Image;

public interface ImageRepository extends CrudRepository<Image, Long> {
}

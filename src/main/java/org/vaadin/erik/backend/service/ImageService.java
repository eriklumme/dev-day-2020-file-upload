package org.vaadin.erik.backend.service;

import org.springframework.stereotype.Service;
import org.vaadin.erik.backend.entity.Defect;
import org.vaadin.erik.backend.entity.Image;
import org.vaadin.erik.backend.repository.DefectRepository;
import org.vaadin.erik.backend.repository.ImageRepository;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
public class ImageService {

    private final ImageRepository imageRepository;
    private final DefectRepository defectRepository;

    public ImageService(ImageRepository imageRepository, DefectRepository defectRepository) {
        this.imageRepository = imageRepository;
        this.defectRepository = defectRepository;
    }

    @Transactional
    public void saveFile(byte[] data, String filename, Long defectId) {
        Optional<Defect> defect = defectRepository.findById(defectId);
        if (!defect.isPresent()) {
            throw new IllegalArgumentException("Failed to find defect with id [" + defectId + "]");
        }
        Image image = imageRepository.findById(defectId).orElseGet(() -> {
                Image i = new Image();
                i.setDefect(defect.get());
                return i;
        });
        image.setData(data);
        image.setFilename(filename);
        imageRepository.save(image);
    }
}

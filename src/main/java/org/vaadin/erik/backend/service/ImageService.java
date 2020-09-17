package org.vaadin.erik.backend.service;

import org.springframework.stereotype.Service;
import org.vaadin.erik.backend.entity.Defect;
import org.vaadin.erik.backend.entity.Image;
import org.vaadin.erik.backend.repository.DefectRepository;
import org.vaadin.erik.backend.repository.ImageRepository;

import javax.transaction.Transactional;

@Service
public class ImageService {

    private final ImageRepository imageRepository;
    private final DefectRepository defectRepository;

    public ImageService(ImageRepository imageRepository, DefectRepository defectRepository) {
        this.imageRepository = imageRepository;
        this.defectRepository = defectRepository;
    }

    @Transactional
    public void saveFile(byte[] data, String filename, String uuid) throws UuidNotFoundException {
        Defect defect = defectRepository.findByUuid(uuid);
        if (defect == null) {
            throw new UuidNotFoundException();
        }
        Image image = imageRepository.findById(defect.getId()).orElseGet(() -> {
                Image i = new Image();
                i.setDefect(defect);
                return i;
        });
        image.setData(data);
        image.setFilename(filename);
        imageRepository.save(image);
    }

    public static class UuidNotFoundException extends Exception {
    }
}

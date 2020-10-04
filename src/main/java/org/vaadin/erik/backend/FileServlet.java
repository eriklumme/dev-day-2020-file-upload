package org.vaadin.erik.backend;

import org.vaadin.erik.backend.service.ImageService;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;

@WebServlet(urlPatterns = "/file")
@MultipartConfig(maxFileSize = FileServlet.MEGABYTE, maxRequestSize = FileServlet.MEGABYTE * 2)
public class FileServlet extends HttpServlet {

    public static final int MEGABYTE = 1024 * 1024;

    private final ImageService imageService;

    public FileServlet(ImageService imageService) {
        this.imageService = imageService;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String defectIdString = req.getParameter("defect_id");
        long defectId;
        try {
            defectId = Long.parseLong(defectIdString);
        } catch (NumberFormatException e) {
            throw new ServletException("Invalid defectId [" + defectIdString + "] must be provided");
        }

        Part filePart = req.getPart("file");
        if (filePart == null) {
            throw new ServletException("No file was uploaded");
        }

        try {
            byte[] data = new byte[(int) filePart.getSize()];
            filePart.getInputStream().read(data);
            imageService.saveFile(data, filePart.getSubmittedFileName(), defectId);
        } catch (IOException e) {
            throw new ServletException("An internal error occurred");
        }
    }
}

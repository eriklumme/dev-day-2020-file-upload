package org.vaadin.erik.backend;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tomcat.util.http.fileupload.impl.SizeLimitExceededException;
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
@MultipartConfig(maxFileSize = FileServlet.FILE_SIZE_LIMIT_MB, maxRequestSize = FileServlet.FILE_SIZE_LIMIT_MB * 2)
public class FileServlet extends HttpServlet {

    private static final Logger logger = LogManager.getLogger(FileServlet.class);

    private static final int MEGABYTE = 1024 * 1024;

    public static final int FILE_SIZE_LIMIT_MB = MEGABYTE;

    private final ImageService imageService;

    public FileServlet(ImageService imageService) {
        this.imageService = imageService;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String defectIdString = null;
        try {
            Part filePart = req.getPart("file");
            if (filePart == null) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "No file was uploaded");
                return;
            }

            defectIdString = req.getParameter("defect_id");
            long defectId = Long.parseLong(defectIdString);

            byte[] data = new byte[(int) filePart.getSize()];
            filePart.getInputStream().read(data);
            imageService.saveFile(data, filePart.getSubmittedFileName(), defectId);

        } catch (IllegalStateException | IOException e) {
            if (e.getCause() instanceof SizeLimitExceededException) {
                resp.sendError(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE,
                        "The file exceeds the upload size limit of " + FILE_SIZE_LIMIT_MB + " MB");
            } else {
                logger.error("Internal error occurred while processing upload", e);
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An internal error occurred");
            }
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid defect_id [" + defectIdString + "]");
        }
    }
}

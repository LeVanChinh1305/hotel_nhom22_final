package com.example.controllers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import io.smallrye.mutiny.Uni;

@Path("/api/files")
public class FileController {

    private static final String UPLOAD_DIR = "uploads";

    public FileController() {
        java.nio.file.Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadFile(@RestForm("file") FileUpload file) {
        if (file == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\": \"No file uploaded\"}").build();
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.fileName();
        java.nio.file.Path targetPath = Paths.get(UPLOAD_DIR, fileName);

        try {
            Files.copy(file.uploadedFile(), targetPath);
            // Trả về URL tuyệt đối để Frontend dễ dàng sử dụng
            String fileUrl = "http://localhost:8080/api/files/" + fileName;
            return Response.ok("{\"url\": \"" + fileUrl + "\"}").build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Failed to save file: " + e.getMessage() + "\"}").build();
        }
    }

    @GET
    @Path("/{fileName}")
    public Response getFile(@PathParam("fileName") String fileName) {
        java.nio.file.Path filePath = Paths.get(UPLOAD_DIR, fileName);
        if (!Files.exists(filePath)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        File file = filePath.toFile();
        String contentType = "image/jpeg"; // Mặc định, bạn có thể dùng Files.probeContentType(filePath)
        try {
            contentType = Files.probeContentType(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return Response.ok(file).type(contentType).build();
    }
}

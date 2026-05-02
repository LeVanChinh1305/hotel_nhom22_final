package com.example.exceptions;

import java.util.Map;

import org.jboss.logging.Logger;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Throwable> {
    
    private static final Logger LOG = Logger.getLogger(GlobalExceptionMapper.class);

    @Override
    public Response toResponse(Throwable e) {
        int status = 500;
        String message = e.getMessage();

        if (e instanceof AppException) {
            AppException appEx = (AppException) e;
            status = appEx.getStatusCode();
            // Log cảnh báo cho các lỗi logic nghiệp vụ (4xx)
            LOG.warnf("App Error [%d]: %s", status, message);
        } else {
            // Log lỗi nghiêm trọng cho các lỗi hệ thống (500, NullPointer, etc.)
            LOG.error("System Error: ", e);
            if (message == null) message = "Lỗi hệ thống không xác định";
        }

        return Response.status(status)
                .entity(Map.of("error", message, "status", status))
                .build();
    }
}
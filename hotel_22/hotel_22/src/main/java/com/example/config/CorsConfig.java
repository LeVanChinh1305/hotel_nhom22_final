package com.example.config;

import java.io.IOException;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

@Provider
public class CorsConfig implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext request,
                       ContainerResponseContext response) throws IOException {
        String origin = request.getHeaderString("Origin");
        if (origin == null || origin.isBlank()) {
            origin = "*";
        }
        response.getHeaders().putSingle("Access-Control-Allow-Origin", origin);
        response.getHeaders().putSingle("Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        response.getHeaders().putSingle("Access-Control-Allow-Headers",
                "Content-Type, Authorization, Accept, Origin, X-Requested-With");
        response.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
        response.getHeaders().putSingle("Access-Control-Max-Age", "3600");
    }
}
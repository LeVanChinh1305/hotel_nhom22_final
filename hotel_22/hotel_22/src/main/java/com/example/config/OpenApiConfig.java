package com.example.config;

import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeIn;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeType;
import org.eclipse.microprofile.openapi.annotations.info.Contact;
import org.eclipse.microprofile.openapi.annotations.info.Info;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.eclipse.microprofile.openapi.annotations.security.SecurityScheme;
import jakarta.ws.rs.core.Application;

@OpenAPIDefinition(
    info = @Info(
        title       = "Hotel 22 API",
        version     = "1.0.0",
        description = "Hệ thống quản lý khách sạn – Nhóm 22",
        contact     = @Contact(name = "Nhóm 22")
    ),
    security = @SecurityRequirement(name = "BearerAuth")
)
@SecurityScheme(
    securitySchemeName = "BearerAuth",
    type               = SecuritySchemeType.HTTP,
    scheme             = "bearer",
    bearerFormat       = "JWT",
    in                 = SecuritySchemeIn.HEADER
)
public class OpenApiConfig extends Application { }
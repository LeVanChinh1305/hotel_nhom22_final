package com.example.controllers;

import com.example.dto.request.LoginRequest;
import com.example.dto.request.RegisterRequest;
import com.example.services.AuthService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {

    @Inject AuthService authService;

    @POST @Path("/register")
    public Response register(RegisterRequest req) {
        return Response.status(201).entity(authService.register(req)).build();
    }

    @POST @Path("/login")
    public Response login(LoginRequest req) {
        return Response.ok(authService.login(req)).build();
    }
}
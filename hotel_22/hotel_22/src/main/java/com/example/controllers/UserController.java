package com.example.controllers;

import com.example.entity.mysql.User;
import com.example.services.UserService;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/profile")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({"CUSTOMER", "ADMIN"})
public class UserController {

    @Inject UserService userService;
    @Inject User currentUser;

    @GET
    public Response getProfile() {
        return Response.ok(userService.getProfile(currentUser)).build();
    }
}
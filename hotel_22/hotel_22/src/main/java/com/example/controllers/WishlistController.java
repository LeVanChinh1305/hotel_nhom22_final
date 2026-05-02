package com.example.controllers;

import com.example.entity.mysql.User;
import com.example.services.WishlistService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/wishlist")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("CUSTOMER")
public class WishlistController {

    @Inject WishlistService wishlistService;
    @Inject User currentUser;

    @GET
    public Response getWishlist() {
        return Response.ok(wishlistService.getWishlist(currentUser)).build();
    }

    @POST @Path("/{roomId}")
    public Response addRoom(@PathParam("roomId") String roomId) {
        return Response.ok(wishlistService.addRoom(currentUser, roomId)).build();
    }

    @DELETE @Path("/{roomId}")
    public Response removeRoom(@PathParam("roomId") String roomId) {
        return Response.ok(wishlistService.removeRoom(currentUser, roomId)).build();
    }
}
package com.example.controllers;

import com.example.dto.request.ReviewRequest;
import com.example.entity.mysql.User;
import com.example.services.ReviewService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/reviews")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReviewController {

    @Inject ReviewService reviewService;
    @Inject User currentUser;

    @POST
    @RolesAllowed("CUSTOMER")
    public Response createReview(ReviewRequest req) {
        return Response.status(201).entity(reviewService.createReview(currentUser, req)).build();
    }

    @GET @Path("/room/{roomId}")
    public Response getReviewsByRoom(@PathParam("roomId") String roomId) {
        return Response.ok(reviewService.getReviewsByRoom(roomId)).build();
    }
}
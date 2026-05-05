package com.example.controllers;

import com.example.dto.request.BookingRequest;
import com.example.entity.mysql.User;
import com.example.services.BookingService;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({"CUSTOMER", "ADMIN"})
public class BookingController {

    @Inject BookingService bookingService;
    @Inject User currentUser;   // CDI inject từ CurrentUserProducer

    @POST
    public Response createBooking(BookingRequest req) {
        return Response.status(201).entity(bookingService.createBooking(currentUser, req)).build();
    }

    @GET
    public Response getMyBookings() {
        return Response.ok(bookingService.getMyBookings(currentUser.id)).build();
    }

    @PUT @Path("/{id}/cancel")
    public Response cancelBooking(@PathParam("id") Long id) {
        return Response.ok(bookingService.cancelBooking(id, currentUser.id)).build();
    }
}
package com.example.controllers;

import com.example.dto.response.RoomResponse;
import com.example.services.RoomService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/rooms")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RoomController {

    @Inject 
    RoomService roomService;

    @GET
    public Response getAllRooms(
            @QueryParam("type") String type,
            @QueryParam("address") String address,
            @QueryParam("minPrice") Double minPrice,
            @QueryParam("maxPrice") Double maxPrice,
            @QueryParam("maxOccupancy") Integer maxOccupancy) {
        return Response.ok(roomService.searchRooms(type, address, minPrice, maxPrice, maxOccupancy)).build();
    }

    @GET @Path("/{id}")
    public Response getById(@PathParam("id") String id) {
        return Response.ok(roomService.getById(id)).build();
    }
}
package com.example.controllers;

import com.example.dto.response.RoomResponse;
import com.example.services.RoomService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/rooms")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RoomController {

    @Inject
    RoomService roomService;

    /**
     * Lấy danh sách phòng (hỗ trợ lọc)
     */
    @GET
    public List<RoomResponse> getAllRooms(
            @QueryParam("type") String type,
            @QueryParam("address") String address,
            @QueryParam("minPrice") Double minPrice,
            @QueryParam("maxPrice") Double maxPrice,
            @QueryParam("maxOccupancy") Integer maxOccupancy) {
        return roomService.searchRooms(type, address, minPrice, maxPrice, maxOccupancy);
    }

    /**
     * Lấy thông tin chi tiết 1 phòng theo ID
     */
    @GET
    @Path("/{id}")
    public RoomResponse getRoomById(@PathParam("id") String id) {
        return roomService.getById(id);
    }
}
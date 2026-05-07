package com.example.controllers;

import java.time.LocalDate;
import java.util.List;

import com.example.dto.response.RoomResponse;
import com.example.services.RoomService;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/rooms")
@Produces(MediaType.APPLICATION_JSON)
@PermitAll
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
            @QueryParam("maxOccupancy") Integer maxOccupancy,
            @QueryParam("checkInDate") String checkInDateStr,
            @QueryParam("checkOutDate") String checkOutDateStr) {
        LocalDate checkInDate = checkInDateStr == null ? null : LocalDate.parse(checkInDateStr);
        LocalDate checkOutDate = checkOutDateStr == null ? null : LocalDate.parse(checkOutDateStr);
        return roomService.searchRooms(
                type, address, minPrice, maxPrice, maxOccupancy,
                checkInDate, checkOutDate);
    }

    /**
     * Lấy thông tin chi tiết 1 phòng theo ID
     */
    @GET
    @Path("/{id}")
    public RoomResponse getRoomById(@PathParam("id") String id) {
        return roomService.getById(id);
    }

    /**
     * Lấy lịch trình trạng thái phòng (Dùng cho hiển thị Lịch ở Frontend)
     */
    @GET
    @Path("/{id}/availability")
    public List<com.example.entity.mongodb.RoomAvailability> getRoomAvailability(@PathParam("id") String id) {
        return roomService.getRoomAvailability(id);
    }
}
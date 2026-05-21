package com.example.controllers;

import com.example.dto.request.CreateNewsRequest;
import com.example.dto.request.CreateRoomRequest;
import com.example.dto.request.CreateServiceRequest;
import com.example.dto.request.CreateUserRequest;
import com.example.dto.request.CreateVoucherRequest;
import com.example.dto.request.SetRoomMaintenanceRequest;
import com.example.dto.request.UpdateBookingStatusRequest;
import com.example.dto.request.UpdateRoomAvailabilityRequest;

import com.example.dto.response.RoomDeletionCheckResponse;
import com.example.entity.mysql.User;
import com.example.repository.mongodb.RoomAvailabilityRepository;
import com.example.services.BookingService;
import com.example.services.HotelServiceService;
import com.example.services.NewsService;
import com.example.services.RoomService;

import com.example.services.UserService;
import com.example.services.VoucherService;

import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.validation.Valid;

@Path("/admin")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class AdminController {

    @Inject RoomService roomService;
    @Inject HotelServiceService hotelServiceService;
    @Inject BookingService bookingService;
    @Inject VoucherService voucherService;
    @Inject NewsService newsService;
    @Inject UserService userService;

    @Inject RoomAvailabilityRepository roomAvailabilityRepository;
    @Inject User currentUser;

    // ===== ROOMS =====
    @GET @Path("/rooms")
    public Response getAllRooms() {
        return Response.ok(roomService.searchRooms(null, null, null, null, null, null, null)).build();
    }

    @POST @Path("/rooms")
    public Response createRoom(@Valid CreateRoomRequest req) {
        return Response.status(201).entity(roomService.create(req)).build();
    }
    @PUT @Path("/rooms/{id}")
    public Response updateRoom(@PathParam("id") String id, CreateRoomRequest req) {
        return Response.ok(roomService.update(id, req)).build();
    }
    @GET @Path("/rooms/{id}/check-deletion")
    public Response checkRoomDeletion(@PathParam("id") String id) {
        var activeBookings = roomService.findActiveBookingsByRoom(id);
        boolean canDelete = activeBookings.isEmpty();
        String message = canDelete 
            ? "Có thể xoá phòng này"
            : "Phòng hiện có " + activeBookings.size() + " đơn đặt phòng đang hoạt động. Để bảo vệ dữ liệu, vui lòng chuyển sang trạng thái BẢO TRÌ (MAINTENANCE) thay vì xoá";
        return Response.ok(new RoomDeletionCheckResponse(
            canDelete,
            activeBookings.stream().map(b -> b.id).toList(),
            message
        )).build();
    }

    @GET @Path("/rooms/{id}/availability")
    public Response getRoomAvailability(@PathParam("id") String id) {
        return Response.ok(roomAvailabilityRepository.find("roomId", id).list()).build();
    }

    @POST @Path("/rooms/{id}/set-maintenance")
    public Response setRoomMaintenance(@PathParam("id") String id, SetRoomMaintenanceRequest req) {
        roomService.setRoomMaintenance(id, req.date, req.status);
        return Response.ok().build();
    }

    @POST @Path("/rooms/{id}/cancel-maintenance")
    public Response cancelRoomMaintenance(@PathParam("id") String id, SetRoomMaintenanceRequest req) {
        roomService.cancelRoomMaintenance(id, req.date);
        return Response.ok().build();
    }

    @DELETE @Path("/rooms/{id}")
    public Response deleteRoom(@PathParam("id") String id) {
        roomService.delete(id);
        return Response.noContent().build();
    }

    // ===== SERVICES =====
    @GET @Path("/services")
    public Response getAllServices() {
        return Response.ok(hotelServiceService.getAll()).build();
    }
    @POST @Path("/services")
    public Response createService(CreateServiceRequest req) {
        return Response.status(201).entity(hotelServiceService.create(req)).build();
    }
    @PUT @Path("/services/{id}")
    public Response updateService(@PathParam("id") String id, CreateServiceRequest req) {
        return Response.ok(hotelServiceService.update(id, req)).build();
    }
    @DELETE @Path("/services/{id}")
    public Response deleteService(@PathParam("id") String id) {
        hotelServiceService.delete(id);
        return Response.noContent().build();
    }

    // ===== BOOKINGS =====
    @GET @Path("/bookings")
    public Response getAllBookings() {
        return Response.ok(bookingService.getAllBookings()).build();
    }
    @PUT @Path("/bookings/{id}")
    public Response updateBooking(@PathParam("id") Long id, UpdateBookingStatusRequest req) {
        return Response.ok(bookingService.updateBookingStatus(id, req.status, req.paymentStatus)).build();
    }

    // ===== ROOM AVAILABILITY =====
    @PUT @Path("/rooms/availability")
    public Response updateRoomAvailability(UpdateRoomAvailabilityRequest req) {
        roomAvailabilityRepository.updateRoomStatusRange(
                req.roomId, req.date, req.date.plusDays(1), req.status, req.bookingId);
        return Response.ok().build();
    }

    // ===== VOUCHERS =====
    @GET @Path("/vouchers")
    public Response getAllVouchers() {
        return Response.ok(voucherService.getAll()).build();
    }
    @POST @Path("/vouchers")
    public Response createVoucher(CreateVoucherRequest req) {
        return Response.status(201).entity(voucherService.create(req)).build();
    }
    @PUT @Path("/vouchers/{id}")
    public Response updateVoucher(@PathParam("id") Long id, CreateVoucherRequest req) {
        return Response.ok(voucherService.update(id, req)).build();
    }
    @PUT @Path("/vouchers/{id}/toggle")
    public Response toggleVoucher(@PathParam("id") Long id) {
        voucherService.toggleStatus(id);
        return Response.ok().build();
    }

    // ===== NEWS =====
    @GET @Path("/news")
    public Response getAllNews() {
        return Response.ok(newsService.getAll()).build();
    }
    @POST @Path("/news")
    public Response createNews(CreateNewsRequest req) {
        return Response.status(201).entity(newsService.create(req)).build();
    }
    @PUT @Path("/news/{id}")
    public Response updateNews(@PathParam("id") String id, CreateNewsRequest req) {
        return Response.ok(newsService.update(id, req)).build();
    }
    @DELETE @Path("/news/{id}")
    public Response deleteNews(@PathParam("id") String id) {
        newsService.delete(id);
        return Response.noContent().build();
    }

    // ===== USERS =====
    @GET @Path("/users")
    public Response getAllUsers() {
        return Response.ok(userService.getAllUsers()).build();
    }
    @PUT @Path("/users/{id}/toggle")
    public Response toggleUserStatus(@PathParam("id") Long id) {
        return Response.ok(userService.toggleUserStatus(id)).build();
    }

    @POST @Path("/users")
    public Response createUser(CreateUserRequest req) {
        return Response.status(201).entity(userService.createUser(req)).build();
    }

    @DELETE @Path("/users/{id}")
    public Response deleteUser(@PathParam("id") Long id) {
        userService.deleteUser(id);
        return Response.noContent().build();
    }


}
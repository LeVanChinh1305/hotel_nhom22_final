package com.example.controllers;

import com.example.dto.request.*;
import com.example.entity.mysql.User;
import com.example.services.*;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/admin")
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
    @Inject RoomStatusLogService roomStatusLogService;
    @Inject MailTemplateService mailTemplateService;
    @Inject User currentUser;

    // ===== ROOMS =====
    @POST @Path("/rooms")
    public Response createRoom(CreateRoomRequest req) {
        return Response.status(201).entity(roomService.create(req)).build();
    }
    @PUT @Path("/rooms/{id}")
    public Response updateRoom(@PathParam("id") String id, CreateRoomRequest req) {
        return Response.ok(roomService.update(id, req)).build();
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
        return Response.status(201).entity(newsService.create(currentUser, req)).build();
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

    // ===== ROOM STATUS LOG =====
    @POST @Path("/room-status")
    public Response logRoomStatus(UpdateRoomStatusRequest req) {
        return Response.status(201).entity(roomStatusLogService.logStatus(req, currentUser.id)).build();
    }
    @GET @Path("/room-status/{roomId}")
    public Response getRoomStatusHistory(@PathParam("roomId") String roomId) {
        return Response.ok(roomStatusLogService.getHistory(roomId)).build();
    }

    // ===== MAIL TEMPLATES =====
    @GET @Path("/mail-templates")
    public Response getAllTemplates() {
        return Response.ok(mailTemplateService.getAll()).build();
    }
    @POST @Path("/mail-templates")
    public Response createTemplate(CreateMailTemplateRequest req) {
        return Response.status(201).entity(mailTemplateService.create(req)).build();
    }
    @PUT @Path("/mail-templates/{id}")
    public Response updateTemplate(@PathParam("id") String id, CreateMailTemplateRequest req) {
        return Response.ok(mailTemplateService.update(id, req)).build();
    }
}
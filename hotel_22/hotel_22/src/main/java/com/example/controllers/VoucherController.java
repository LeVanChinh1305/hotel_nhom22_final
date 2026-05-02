package com.example.controllers;

import com.example.services.VoucherService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/vouchers")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({"CUSTOMER", "ADMIN"})
public class VoucherController {

    @Inject VoucherService voucherService;

    @GET @Path("/validate")
    public Response validate(@QueryParam("code") String code,
                             @QueryParam("totalPrice") Double totalPrice) {
        return Response.ok(voucherService.validateVoucher(code, totalPrice)).build();
    }
}
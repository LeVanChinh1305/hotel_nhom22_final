package com.example.controllers;

import java.util.List;

import com.example.dto.response.VoucherResponse;
import com.example.services.VoucherService;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/vouchers")
@Produces(MediaType.APPLICATION_JSON)
public class VoucherController {

    @Inject
    VoucherService voucherService;

    /**
     * Endpoint cho khách hàng xem các mã giảm giá hiện có
     */
    @GET
    @PermitAll
    public Response getAvailableVouchers() {
        List<VoucherResponse> vouchers = voucherService.getAvailableVouchers();
        return Response.ok(vouchers).build();
    }

    /**
     * Endpoint để kiểm tra nhanh một mã voucher (dùng trong trang đặt phòng)
     */
    @GET
    @Path("/validate")
    @RolesAllowed({"CUSTOMER", "ADMIN"})
    public Response validateVoucher(@QueryParam("code") String code, 
                                   @QueryParam("totalPrice") Double totalPrice) {
        VoucherResponse response = voucherService.validateVoucher(code, totalPrice);
        return Response.ok(response).build();
    }
}
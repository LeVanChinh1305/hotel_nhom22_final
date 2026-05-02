package com.example.mapper;

import com.example.dto.response.BookingResponse;
import com.example.entity.mysql.Booking;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {
        if (booking == null) return null;
        BookingResponse res = new BookingResponse();
        res.id               = booking.id;
        res.userId           = booking.user.id;
        res.roomId           = booking.roomId;
        res.checkInDate      = booking.checkInDate;
        res.checkOutDate     = booking.checkOutDate;
        res.totalRoomPrice   = booking.totalRoomPrice;
        res.totalServicePrice= booking.totalServicePrice;
        res.discountAmount   = booking.discountAmount;
        res.totalPrice       = booking.totalPrice;
        res.status           = booking.status.name();
        res.paymentStatus    = booking.paymentStatus;
        res.createdAt        = booking.createdAt;
        return res;
    }
}
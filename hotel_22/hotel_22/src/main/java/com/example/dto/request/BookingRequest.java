package com.example.dto.request;

import java.time.LocalDate;
import java.util.List;

public class BookingRequest {
    public String roomId;
    public LocalDate checkInDate;
    public LocalDate checkOutDate;
    public String voucherCode;          // nullable
    public List<BookingServiceItemRequest> services;

    public static class BookingServiceItemRequest {
        public String serviceId;
        public Integer quantity;
    }
}
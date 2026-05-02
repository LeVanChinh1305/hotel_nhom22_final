package com.example.dto.response;

import com.example.entity.mysql.Booking;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {
    public Long id;
    public Long userId;
    public String roomId;
    public LocalDate checkInDate;
    public LocalDate checkOutDate;
    public Double totalRoomPrice;
    public Double totalServicePrice;
    public Double discountAmount;
    public Double totalPrice;
    public String status;
    public Boolean paymentStatus;
    public LocalDateTime createdAt;
}
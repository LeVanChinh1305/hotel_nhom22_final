package com.example.mapper;

import com.example.dto.response.BookingResponse;
import com.example.entity.mongodb.Room;
import com.example.entity.mongodb.Service;
import com.example.entity.mysql.Booking;
import com.example.entity.mysql.BookingServiceItem;
import com.example.repository.mongodb.RoomRepository;
import com.example.repository.mongodb.ServiceRepository;
import com.example.repository.mysql.BookingServiceItemRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class BookingMapper {

    @Inject RoomRepository roomRepository;
    @Inject ServiceRepository serviceRepository;
    @Inject BookingServiceItemRepository bookingServiceItemRepository;

    public BookingResponse toResponse(Booking booking) {
        if (booking == null) return null;
        BookingResponse res = new BookingResponse();
        res.id               = booking.id;
        res.userId           = booking.user.getId();
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

        // Thông tin khách hàng
        if (booking.user != null) {
            res.customerName = booking.user.fullName;
            res.customerEmail = booking.user.email;
            res.customerPhone = booking.user.phone;
        }

        // Map Room details
        try {
            Room room = roomRepository.findById(new ObjectId(booking.roomId));
            if (room != null) {
                res.roomNumber = room.roomNumber;
                res.roomType = room.type.name();
                res.occupancy = room.maxOccupancy;
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi map Room info: " + e.getMessage());
        }

        // Map Voucher info
        if (booking.voucher != null) {
            res.voucherCode = booking.voucher.code;
        }

        // Map Services
        List<BookingServiceItem> items = bookingServiceItemRepository.find("booking", booking).list();
        res.services = items.stream().map(item -> {
            BookingResponse.ServiceItemResponse sr = new BookingResponse.ServiceItemResponse();
            sr.quantity = item.quantity;
            sr.price = item.priceAtBooking;
            sr.numberOfPeople = item.numberOfPeople;
            sr.numberOfDays = item.numberOfDays;
            
            // Lấy tên service từ MongoDB
            try {
                Service svc = serviceRepository.findById(new ObjectId(item.serviceId));
                sr.serviceName = (svc != null) ? svc.serviceName : "Dịch vụ không xác định";
            } catch (Exception e) {
                sr.serviceName = "Lỗi tải tên dịch vụ";
            }
            return sr;
        }).collect(Collectors.toList());

        return res;
    }
}
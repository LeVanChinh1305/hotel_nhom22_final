package com.example.entity.mysql;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id; // Khóa chính

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    public User user; // Khách hàng

    @Column(name = "room_id", nullable = false)
    public String roomId; // MongoDB ObjectId

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id") // Nullable
    public Voucher voucher; // Voucher giảm giá

    @Column(name = "check_in_date", nullable = false)
    public LocalDate checkInDate; // Ngày nhận phòng

    @Column(name = "check_out_date", nullable = false)
    public LocalDate checkOutDate;// Ngày trả phòng

    @Column(name = "total_room_price", nullable = false)
    public Double totalRoomPrice; // Tổng tiền phòng

    @Column(name = "total_service_price", nullable = false) // Tổng tiền dịch vụ
    public Double totalServicePrice;

    @Column(name = "discount_amount") // Số tiền được giảm giá
    public Double discountAmount = 0.0;

    @Column(name = "total_price", nullable = false) // Tổng tiền sau khi giảm giá
    public Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public BookingStatus status = BookingStatus.PENDING; // Trạng thái: PENDING, CONFIRMED, CANCELLED, COMPLETED

    @Column(name = "created_at")
    public LocalDateTime createdAt; // Ngày tạo

    @Column(name = "payment_status", nullable = false) // Trạng thái thanh toán
    public Boolean paymentStatus = false;

    @Column(name = "is_confirmed_mail_sent", nullable = false)
    public Boolean isConfirmedMailSent = false;

    @Column(name = "is_reminder_mail_sent", nullable = false)
    public Boolean isReminderMailSent = false;
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public enum BookingStatus {
        PENDING, CONFIRMED, CHECKED_IN, CANCELLED, COMPLETED
    }
}
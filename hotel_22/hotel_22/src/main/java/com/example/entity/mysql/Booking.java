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
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @Column(name = "room_id", nullable = false)
    public String roomId; // MongoDB ObjectId

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    public Voucher voucher; // Nullable

    @Column(name = "check_in_date", nullable = false)
    public LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    public LocalDate checkOutDate;

    @Column(name = "total_room_price", nullable = false)
    public Double totalRoomPrice;

    @Column(name = "total_service_price", nullable = false)
    public Double totalServicePrice;

    @Column(name = "discount_amount")
    public Double discountAmount = 0.0;

    @Column(name = "total_price", nullable = false)
    public Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public BookingStatus status = BookingStatus.PENDING;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Column(name = "payment_status", nullable = false)
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
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }
}
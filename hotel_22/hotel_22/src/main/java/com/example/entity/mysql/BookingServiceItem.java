package com.example.entity.mysql;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "booking_services")
public class BookingServiceItem extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    public Booking booking;

    @Column(name = "service_id", nullable = false)
    public String serviceId; // MongoDB ObjectId

    @Column(nullable = false)
    public Integer quantity;

    @Column(name = "num_people")
    public Integer numberOfPeople;

    @Column(name = "num_days")
    public Integer numberOfDays;

    @Column(name = "price_at_booking", nullable = false)
    public Double priceAtBooking; // Lưu giá tại thời điểm đặt
}
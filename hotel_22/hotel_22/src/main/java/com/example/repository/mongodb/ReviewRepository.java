package com.example.repository.mongodb;

import com.example.entity.mongodb.Review;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class ReviewRepository implements PanacheMongoRepository<Review> {
    public List<Review> findByBookingId(Long bookingId) {
        return find("bookingId", bookingId).list();
    }
    public boolean existsByBookingId(Long bookingId) {
        return count("bookingId", bookingId) > 0;
    }
}
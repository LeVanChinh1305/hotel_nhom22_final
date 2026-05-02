package com.example.services;

import com.example.dto.request.ReviewRequest;
import com.example.dto.response.ReviewResponse;
import com.example.entity.mongodb.Review;
import com.example.entity.mysql.Booking;
import com.example.entity.mysql.User;
import com.example.exceptions.AppException;
import com.example.repository.mongodb.ReviewRepository;
import com.example.repository.mysql.BookingRepository;
import com.example.utils.ValidationUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ReviewService {

    @Inject ReviewRepository reviewRepository;
    @Inject BookingRepository bookingRepository;

    public ReviewResponse createReview(User currentUser, ReviewRequest req) {

        // 1. Validate
        ValidationUtils.validateRating(req.rating);
        if (req.bookingId == null)
            throw new AppException("Vui lòng cung cấp ID đơn đặt phòng", 400);

        // 2. Kiểm tra đơn tồn tại & thuộc về user
        Booking booking = bookingRepository.findByIdOptional(req.bookingId)
                .orElseThrow(() -> new AppException("Đơn đặt phòng không tồn tại", 404));

        if (!booking.user.id.equals(currentUser.id))
            throw new AppException("Bạn không có quyền đánh giá đơn này", 403);

        // 3. Chỉ review đơn đã hoàn tất (COMPLETED)
        if (booking.status != Booking.BookingStatus.COMPLETED)
            throw new AppException("Chỉ có thể đánh giá sau khi hoàn tất kỳ lưu trú", 400);

        // 4. Mỗi đơn chỉ được đánh giá 1 lần
        if (reviewRepository.existsByBookingId(req.bookingId))
            throw new AppException("Bạn đã đánh giá đơn này rồi", 409);

        // 5. Lưu review
        Review review = new Review();
        review.bookingId = req.bookingId;
        review.userId    = currentUser.id;
        review.rating    = req.rating;
        review.comment   = req.comment != null ? req.comment.trim() : "";
        reviewRepository.persist(review);

        return ReviewResponse.from(review);
    }

    public List<ReviewResponse> getReviewsByRoom(String roomId) {
        // Lấy tất cả booking của phòng → lấy review tương ứng
        List<Long> bookingIds = bookingRepository.find("roomId", roomId)
                .stream()
                .map(b -> b.id)
                .collect(Collectors.toList());

        if (bookingIds.isEmpty()) return List.of();

        return reviewRepository.list("bookingId in ?1", bookingIds)
                .stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }

    public double getAverageRating(String roomId) {
        List<ReviewResponse> reviews = getReviewsByRoom(roomId);
        if (reviews.isEmpty()) return 0.0;
        return reviews.stream()
                .mapToInt(r -> r.rating)
                .average()
                .orElse(0.0);
    }
}
package com.example.dto.response;

import com.example.entity.mongodb.Review;

public class ReviewResponse {
    public String id;
    public Long bookingId;
    public Long userId;
    public Integer rating;
    public String comment;

    public static ReviewResponse from(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.id = r.id.toHexString(); res.bookingId = r.bookingId;
        res.userId = r.userId; res.rating = r.rating; res.comment = r.comment;
        return res;
    }
}
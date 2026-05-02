package com.example.entity.mongodb;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "reviews")
public class Review extends PanacheMongoEntityBase {

    public ObjectId id;

    public Long bookingId;  // FK sang MySQL bookings.id

    public Long userId;     // FK sang MySQL users.id

    public Integer rating;  // 1 - 5 sao

    public String comment;
}
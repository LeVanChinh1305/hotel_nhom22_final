package com.example.entity.mongodb;

import java.util.List;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "wishlists")
public class Wishlist extends PanacheMongoEntityBase {

    public ObjectId id;

    public Long userId;             // FK sang MySQL users.id

    public List<String> roomIds;    // Danh sách ObjectId của rooms
}
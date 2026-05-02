package com.example.entity.mongodb;

import java.util.List;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "rooms")
public class Room extends PanacheMongoEntityBase {

    public ObjectId id;

    public String roomNumber;   // Ví dụ: "P.302"

    public String type;         // Single, Double, Suite, Deluxe

    public Double basePrice;    // Giá mỗi đêm

    public String address;

    public String description;

    public List<String> amenities; // ["Wifi", "Điều hòa", ...]

    public List<String> images;    // Danh sách URL ảnh

    public Integer maxOccupancy;
}
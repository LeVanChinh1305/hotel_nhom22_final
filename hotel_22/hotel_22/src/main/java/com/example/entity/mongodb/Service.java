package com.example.entity.mongodb;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "services")
public class Service extends PanacheMongoEntityBase {

    public ObjectId id;

    public String serviceName;  // "Đưa đón sân bay", "Ăn sáng tại phòng"

    public String description;

    public Double price;

    public String unit;         // "Lượt", "Ngày", "Người"

    public Boolean isAvailable = true;
}
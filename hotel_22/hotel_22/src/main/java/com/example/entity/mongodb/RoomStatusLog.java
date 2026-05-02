package com.example.entity.mongodb;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "room_status_logs")
public class RoomStatusLog extends PanacheMongoEntityBase {

    public ObjectId id;

    public String roomId;       // FK sang rooms._id

    public String status;       // AVAILABLE, OCCUPIED, CLEANING, MAINTENANCE

    public Long updatedBy;      // ID Admin thực hiện thay đổi

    public LocalDateTime updatedAt;
}